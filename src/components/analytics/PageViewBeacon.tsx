"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics/track";

/** Mounted once per public page; logs exactly one page_view per visit. */
export function PageViewBeacon() {
  useEffect(() => {
    track("page_view");
  }, []);
  return null;
}
