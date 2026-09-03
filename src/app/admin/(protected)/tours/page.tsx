import { requireRole } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { ToursManager } from "./ToursManager";

export default async function ToursPage() {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const { data } = await supabase
    .from("tours")
    .select(
      "id, slug, title, price, currency_symbol, departure_start, departure_end, image_url, image_w, image_h, hover_image_url, hover_image_w, hover_image_h, button_label, is_published",
    )
    .order("sort_order");

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--gn-palette-3)]">Próximas salidas</h1>
      <p className="mt-1 text-sm text-[var(--gn-palette-5)]">
        Las tarjetas de destinos que se muestran en la portada. Desmarca &quot;Publicado&quot; para
        ocultar una salida sin borrarla.
      </p>
      <div className="mt-6">
        <ToursManager tours={data ?? []} />
      </div>
    </div>
  );
}
