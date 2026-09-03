import type { NextRequest } from "next/server";
import { refreshSessionAndGuard } from "@/lib/supabase/proxy-session";

/**
 * Next.js 16 renamed `middleware.ts` → `proxy.ts` (same API, exported
 * function renamed `proxy`). This only does the cheap, cookie-only
 * "is there a session" redirect for `/admin/*` — see
 * `src/lib/supabase/proxy-session.ts` for why, and `src/lib/auth/dal.ts` for
 * the real, DB-backed role check every protected page/action performs itself.
 *
 * IMPORTANT: this matcher must include Server Actions called from `/admin/*`
 * pages — a matcher that excludes a path also skips Server Action calls made
 * from that path, so never narrow this beyond what's below without
 * re-checking that every admin mutation still gets guarded.
 */
export async function proxy(request: NextRequest) {
  return refreshSessionAndGuard(request);
}

export const config = {
  matcher: [
    /*
     * Run on every route except static assets and image optimization files —
     * matches the Next.js docs' recommended default matcher.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|gif|ico)$).*)",
  ],
};
