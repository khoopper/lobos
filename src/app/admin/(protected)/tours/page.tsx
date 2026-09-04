import { requireRole } from "@/lib/auth/dal";
import { getStoredTourDetailRecord, resolveTourDetailCopies } from "@/lib/queries/tour-details";
import { createClient } from "@/lib/supabase/server";
import { ToursManager } from "./ToursManager";

function getDuration(start: string, end: string | null) {
  if (!end) return "1 día";
  const startDate = new Date(`${start}T00:00:00Z`);
  const endDate = new Date(`${end}T00:00:00Z`);
  const days = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / 86_400_000) + 1);
  return `${days} días`;
}

export default async function ToursPage() {
  const toursPromise = createClient().then((supabase) => supabase
    .from("tours")
    .select(
      "id, slug, title, price, currency_symbol, departure_start, departure_end, image_url, image_w, image_h, hover_image_url, hover_image_w, hover_image_h, button_label, is_published",
    )
    .order("sort_order"));
  const [, { data }, storedDetails] = await Promise.all([
    requireRole(["admin"]),
    toursPromise,
    getStoredTourDetailRecord(),
  ]);
  const tours = data ?? [];
  const details = resolveTourDetailCopies(tours.map((tour) => ({
    id: tour.id,
    slug: tour.slug,
    duration: getDuration(tour.departure_start, tour.departure_end),
    price: [tour.currency_symbol, tour.price].filter(Boolean).join(" "),
  })), storedDetails);

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-[var(--gn-palette-3)]">Aventuras y salidas</h1>
      <p className="mt-1 text-sm text-[var(--gn-palette-5)]">
        Tarjetas visibles en la portada. Desmarca &quot;Publicado&quot; para ocultar una salida sin eliminarla.
      </p>
      <div className="mt-6">
        <ToursManager tours={tours.map((tour) => ({ ...tour, details: details[tour.id] }))} />
      </div>
    </div>
  );
}
