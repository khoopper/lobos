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
      "id, slug, title, price, currency_symbol, departure_start, departure_end, images, button_label, is_published",
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
    <ToursManager tours={tours.map((tour) => ({ ...tour, details: details[tour.id] }))} />
  );
}
