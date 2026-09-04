"use server";

import { requireRole } from "@/lib/auth/dal";
import { createServiceRoleClient } from "@/lib/supabase/server";

export type StorageBucket = "site-assets" | "media";

export const BRAND_PACKAGE_FILES = [
  "logo-white-640.png",
  "logo-white-1024.png",
  "logo-black-640.png",
  "favicon-16.png",
  "favicon-32.png",
  "favicon-48.png",
  "apple-touch-icon.png",
  "icon-192.png",
  "icon-512.png",
  "icon-maskable-512.png",
  "og-image.png",
] as const;

/**
 * Admin-only. Mints a short-lived signed upload URL so the browser can PUT
 * the file bytes directly to Supabase Storage — the file never passes
 * through a Server Action (which defaults to a 1MB body limit in Next.js).
 * Bucket-level `file_size_limit`/`allowed_mime_types` (see
 * supabase/migrations/0001_init.sql) are the real enforcement, since a
 * client-supplied Content-Type is spoofable.
 */
export async function getSignedUploadUrl(bucket: StorageBucket, extension: string) {
  await requireRole(["admin"]);

  const safeExt = extension.replace(/[^a-z0-9]/gi, "").toLowerCase() || "jpg";
  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${safeExt}`;

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(path);
  if (error) throw new Error(error.message);

  const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
  return { signedUrl: data.signedUrl, token: data.token, path, publicUrl };
}

/** One PNG in the admin becomes a complete, versioned brand folder. */
export async function getBrandPackageUploadTargets() {
  await requireRole(["admin"]);
  const folder = `brand/${crypto.randomUUID()}`;
  const supabase = createServiceRoleClient();
  const targets = await Promise.all(
    BRAND_PACKAGE_FILES.map(async (filename) => {
      const path = `${folder}/${filename}`;
      const { data, error } = await supabase.storage.from("site-assets").createSignedUploadUrl(path);
      if (error) throw new Error(error.message);
      return {
        filename,
        path,
        signedUrl: data.signedUrl,
        token: data.token,
        publicUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/site-assets/${path}`,
      };
    }),
  );
  return targets;
}
