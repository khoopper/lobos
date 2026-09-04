import { requireRole } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { GalleryManager } from "./GalleryManager";

export default async function GalleryPage() {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery_items")
    .select("id, image_url, image_w, image_h, title, is_published")
    .order("sort_order");

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
