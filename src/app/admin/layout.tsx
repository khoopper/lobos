import type { Metadata } from "next";

// The whole /admin subtree is private tooling, never a search result —
// robots.txt already disallows crawling it, this belts-and-braces it with
// a noindex meta tag in case a page is ever linked to from elsewhere.
export const metadata: Metadata = { title: "Panel de administración", robots: { index: false, follow: false } };

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
