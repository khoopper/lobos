import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ProfileRole } from "@/lib/supabase/types";

export interface Session {
  userId: string;
  email: string | null;
  role: ProfileRole;
}

/**
 * The real, DB-backed authorization check. `src/proxy.ts` only does an
 * optimistic cookie check — this is what every protected Server Component,
 * Server Action, and Route Handler must call itself, because a Proxy matcher
 * mistake can otherwise let a Server Action through ungated.
 *
 * `cache()` memoizes this per request, so calling it from a layout AND a page
 * AND a Server Action in the same request only hits the DB once.
 */
export const verifySession = cache(async (): Promise<Session> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

  if (!profile) redirect("/admin/login");

  return { userId: user.id, email: user.email ?? null, role: profile.role };
});

/**
 * Call at the top of any admin Server Component or Server Action that must be
 * restricted to specific roles. Redirects (never just hides UI) if the
 * signed-in user's role isn't in `roles`.
 *
 * Workers are only ever passed `["admin", "worker"]` on `/admin/bookings`
 * (read-only there) and `["admin"]` everywhere else — see
 * `src/app/admin/*` route files.
 */
export async function requireRole(roles: ProfileRole[]): Promise<Session> {
  const session = await verifySession();
  if (!roles.includes(session.role)) {
    // A worker hitting anything outside /admin/bookings lands on the one
    // screen they're allowed to see, instead of a dead end.
    redirect("/admin/bookings");
  }
  return session;
}
