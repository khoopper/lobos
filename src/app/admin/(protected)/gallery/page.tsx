import { requireRole } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { GalleryManager } from "./GalleryManager";

export default async function GalleryPage() {
  const galleryPromise = createClient().then((supabase) => supabase
    .from("gallery_items")
    .select("id, image_url, image_w, image_h, title, is_published")
    .order("sort_order"));
  const [, { data }] = await Promise.all([requireRole(["admin"]), galleryPromise]);

  return <GalleryManager items={data ?? []} />;
}
