import { requireRole } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { ReviewsManager } from "./ReviewsManager";

export default async function ReviewsPage() {
  const reviewsPromise = createClient().then((supabase) => supabase
    .from("reviews")
    .select("id, author, review_date, rating, body_text, is_published")
    .order("sort_order"));
  const [, { data }] = await Promise.all([requireRole(["admin"]), reviewsPromise]);

  return <ReviewsManager reviews={data ?? []} />;
}
