"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const EventSchema = z.object({
  eventType: z.enum(["page_view", "tour_click", "cta_click", "social_click"]),
  path: z.string().min(1).max(300),
  label: z.string().max(200).optional(),
});

/**
 * Public, fire-and-forget telemetry — same anon-insert-only RLS shape as the
 * booking form (supabase/migrations/0003_analytics.sql). Best-effort: a
 * malformed payload or a DB hiccup silently drops the event instead of
 * surfacing an error to the visitor, since this never blocks the page.
 */
export async function trackEvent(raw: unknown): Promise<void> {
  const parsed = EventSchema.safeParse(raw);
  if (!parsed.success) return;
  const supabase = await createClient();
  await supabase.from("analytics_events").insert({
    event_type: parsed.data.eventType,
    path: parsed.data.path,
    label: parsed.data.label || null,
  });
}
