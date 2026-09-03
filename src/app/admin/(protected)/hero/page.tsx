import { requireRole } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { HeroSlidesManager } from "./HeroSlidesManager";

export default async function HeroPage() {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const { data } = await supabase
    .from("hero_slides")
    .select("id, image_url, image_w, image_h, heading, description, button_label, href")
    .order("sort_order");

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--gn-palette-3)]">Portada</h1>
      <p className="mt-1 text-sm text-[var(--gn-palette-5)]">
        Las diapositivas que giran automáticamente en la parte superior del sitio. Usa las flechas para
        cambiar el orden.
      </p>
      <div className="mt-6">
        <HeroSlidesManager slides={data ?? []} />
      </div>
    </div>
  );
}
