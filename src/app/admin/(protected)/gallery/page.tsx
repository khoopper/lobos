import { requireRole } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { GalleryManager } from "./GalleryManager";

export default async function GalleryPage() {
  const galleryPromise = createClient().then((supabase) => supabase
    .from("gallery_items")
    .select("id, image_url, image_w, image_h, title, is_published")
    .order("sort_order"));
  const [, { data }] = await Promise.all([requireRole(["admin"]), galleryPromise]);

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-[var(--gn-palette-3)]">Galería</h1>
      <p className="mt-1 text-sm text-[var(--gn-palette-5)]">
        Fotografías de rutas, salidas y experiencias de la comunidad.
      </p>
      <div className="mt-6">
        <GalleryManager items={data ?? []} />
      </div>
    </div>
  );
}
