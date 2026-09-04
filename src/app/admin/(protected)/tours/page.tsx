import { requireRole } from "@/lib/auth/dal";
import { getStoredTourDetailRecord, resolveTourDetailCopies } from "@/lib/queries/tour-details";
import { createClient } from "@/lib/supabase/server";
import { ToursManager } from "./ToursManager";

export default async function ToursPage() {
  const toursPromise = createClient().then((supabase) => supabase
    .from("tours")
    .select(
      "id, slug, title, price, currency_symbol, departure_dates, images, button_label, is_published",
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
    price: [tour.currency_symbol, tour.price].filter(Boolean).join(" "),
  })), storedDetails);

  return (
    <ToursManager tours={tours.map((tour) => ({ ...tour, details: details[tour.id] }))} />
  );
}
