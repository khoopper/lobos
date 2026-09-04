import { requireRole } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { ReviewsManager } from "./ReviewsManager";

export default async function ReviewsPage() {
  const reviewsPromise = createClient().then((supabase) => supabase
    .from("reviews")
    .select("id, author, review_date, rating, body_text, is_published")
    .order("sort_order"));
  const [, { data }] = await Promise.all([requireRole(["admin"]), reviewsPromise]);

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-[var(--gn-palette-3)]">Testimonios</h1>
      <p className="mt-1 text-sm text-[var(--gn-palette-5)]">
        Publica únicamente testimonios reales y autorizados.
      </p>
      <div className="mt-6">
        <ReviewsManager reviews={data ?? []} />
      </div>
    </div>
  );
}
