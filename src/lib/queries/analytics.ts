import "server-only";
import { createClient } from "@/lib/supabase/server";

const DAY_MS = 86_400_000;

export interface DashboardMetrics {
  available: boolean;
  visitsToday: number;
  visits7d: number;
  dailyVisits: { date: string; count: number }[];
  topTours: { label: string; count: number }[];
  topCtas: { label: string; count: number }[];
  socialClicks7d: number;
  pendingBookings: number;
  publishedTours: number;
}

function startOfDayUTC(date: Date) {
  const copy = new Date(date);
  copy.setUTCHours(0, 0, 0, 0);
  return copy;
}

function topLabels(rows: { label: string | null }[] | null | undefined, limit: number) {
  const counts = new Map<string, number>();
  for (const row of rows ?? []) {
    if (!row.label) continue;
    counts.set(row.label, (counts.get(row.label) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

const EMPTY_METRICS: DashboardMetrics = {
  available: false,
  visitsToday: 0,
  visits7d: 0,
  dailyVisits: [],
  topTours: [],
  topCtas: [],
  socialClicks7d: 0,
  pendingBookings: 0,
  publishedTours: 0,
};

/**
 * Best-effort: `analytics_events` only exists once
 * supabase/migrations/0003_analytics.sql has been applied. Until then this
 * quietly returns zeros (`available: false`) instead of crashing the
 * dashboard for every admin who hasn't run that migration yet.
 */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createClient();
  const todayStart = startOfDayUTC(new Date());
  const sevenDaysAgo = new Date(todayStart.getTime() - 6 * DAY_MS);

  const [
    visitsTodayRes,
    pageViews7dRes,
    tourClicks7dRes,
    ctaClicks7dRes,
    socialClicks7dRes,
    pendingBookingsRes,
    publishedToursRes,
  ] = await Promise.all([
    supabase.from("analytics_events").select("id", { count: "exact", head: true }).eq("event_type", "page_view").gte("created_at", todayStart.toISOString()),
    supabase.from("analytics_events").select("created_at").eq("event_type", "page_view").gte("created_at", sevenDaysAgo.toISOString()),
    supabase.from("analytics_events").select("label").eq("event_type", "tour_click").gte("created_at", sevenDaysAgo.toISOString()),
    supabase.from("analytics_events").select("label").eq("event_type", "cta_click").gte("created_at", sevenDaysAgo.toISOString()),
    supabase.from("analytics_events").select("id", { count: "exact", head: true }).eq("event_type", "social_click").gte("created_at", sevenDaysAgo.toISOString()),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("tours").select("id", { count: "exact", head: true }).eq("is_published", true),
  ]);

  if (visitsTodayRes.error || pageViews7dRes.error) return EMPTY_METRICS;

  const dailyBuckets = new Map<string, number>();
  for (let i = 0; i < 7; i += 1) {
    const day = new Date(sevenDaysAgo.getTime() + i * DAY_MS);
    dailyBuckets.set(day.toISOString().slice(0, 10), 0);
  }
  for (const row of pageViews7dRes.data ?? []) {
    const key = row.created_at.slice(0, 10);
    if (dailyBuckets.has(key)) dailyBuckets.set(key, (dailyBuckets.get(key) ?? 0) + 1);
  }

  return {
    available: true,
    visitsToday: visitsTodayRes.count ?? 0,
    visits7d: pageViews7dRes.data?.length ?? 0,
    dailyVisits: [...dailyBuckets.entries()].map(([date, count]) => ({ date, count })),
    topTours: topLabels(tourClicks7dRes.data, 5),
    topCtas: topLabels(ctaClicks7dRes.data, 5),
    socialClicks7d: socialClicks7dRes.count ?? 0,
    pendingBookings: pendingBookingsRes.count ?? 0,
    publishedTours: publishedToursRes.count ?? 0,
  };
}
