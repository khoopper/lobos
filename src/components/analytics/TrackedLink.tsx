"use client";

import type { AnchorHTMLAttributes } from "react";
import { track, type AnalyticsEventType } from "@/lib/analytics/track";

interface TrackedLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  eventType: AnalyticsEventType;
  eventLabel?: string;
}

/** A plain `<a>` that also logs a click — for tracking a link inside an otherwise-server component without converting the whole thing to a Client Component. */
export function TrackedLink({ eventType, eventLabel, onClick, ...anchorProps }: TrackedLinkProps) {
  return (
    <a
      {...anchorProps}
      onClick={(event) => {
        track(eventType, eventLabel);
        onClick?.(event);
      }}
    />
  );
}
