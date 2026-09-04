import { requireRole } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { HeroSlidesManager } from "./HeroSlidesManager";

export default async function HeroPage() {
  const slidesPromise = createClient().then((supabase) => supabase
    .from("hero_slides")
    .select("id, image_url, image_w, image_h, heading, description, button_label, href, is_published")
    .order("sort_order"));
  const [, { data }] = await Promise.all([requireRole(["admin"]), slidesPromise]);

  return <HeroSlidesManager slides={data ?? []} />;
}
