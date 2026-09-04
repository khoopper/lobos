/** Single source of truth for the canonical site URL — used by metadata,
 * the sitemap, robots.txt, and structured data, so they can never drift. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lobos-chi.vercel.app";
export const SITE_NAME = "Club de Lobos";
