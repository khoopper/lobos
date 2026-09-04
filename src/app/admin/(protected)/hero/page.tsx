import { requireRole } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { HeroSlidesManager } from "./HeroSlidesManager";

export default async function HeroPage() {
  const slidesPromise = createClient().then((supabase) => supabase
    .from("hero_slides")
    .select("id, image_url, image_w, image_h, heading, description, button_label, href, is_published")
    .order("sort_order"));
  const [, { data }] = await Promise.all([requireRole(["admin"]), slidesPromise]);

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-[var(--gn-palette-3)]">Portada</h1>
      <p className="mt-1 text-sm text-[var(--gn-palette-5)]">
        Edita las diapositivas del inicio. Usa las flechas para cambiar su orden y el interruptor para publicarlas.
      </p>
      <div className="mt-6">
        <HeroSlidesManager slides={data ?? []} />
      </div>
    </div>
  );
}
