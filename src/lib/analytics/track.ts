"use client";

import { trackEvent } from "@/app/actions/analytics";

export type AnalyticsEventType = "page_view" | "tour_click" | "cta_click" | "social_click";

/** Fire-and-forget: never awaited by the caller, never throws into the UI. */
export function track(eventType: AnalyticsEventType, label?: string) {
  if (typeof window === "undefined") return;
  void trackEvent({ eventType, path: window.location.pathname, label }).catch(() => {});
}
