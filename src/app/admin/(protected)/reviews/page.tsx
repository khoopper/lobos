import { requireRole } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { ReviewsManager } from "./ReviewsManager";

export default async function ReviewsPage() {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("id, author, review_date, rating, body_text, is_published")
    .order("sort_order");

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--gn-palette-3)]">Reseñas</h1>
      <p className="mt-1 text-sm text-[var(--gn-palette-5)]">
        Las reseñas de clientes que se muestran en el sitio.
      </p>
      <div className="mt-6">
        <ReviewsManager reviews={data ?? []} />
      </div>
    </div>
  );
}
