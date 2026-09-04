import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { getSiteSettings } from "@/lib/queries/site-content";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lobos-chi.vercel.app";
const BRAND = "/brand/lobos";
const TITLE = "Club de Lobos | Aventuras, camping y montaña";
const DESCRIPTION =
  "Somos un club de amigos que disfruta la aventura, el senderismo, el camping y vivir cada ruta al máximo.";

function brandSibling(faviconUrl: string | null, filename: string, fallback: string) {
  if (!faviconUrl || !faviconUrl.includes("/")) return fallback;
  const base = faviconUrl.slice(0, faviconUrl.lastIndexOf("/"));
  return `${base}/${filename}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const favicon = settings.faviconUrl ?? `${BRAND}/favicon-32.png`;
  const icon192 = brandSibling(settings.faviconUrl, "icon-192.png", `${BRAND}/icon-192.png`);
  const apple = brandSibling(settings.faviconUrl, "apple-touch-icon.png", `${BRAND}/apple-touch-icon.png`);
  const og = brandSibling(settings.faviconUrl, "og-image.png", `${BRAND}/og-image.png`);

  return {
    metadataBase: new URL(SITE_URL),
    title: TITLE,
    description: DESCRIPTION,
    applicationName: "Club de Lobos",
    alternates: { canonical: "/" },
    icons: {
      icon: [
        { url: favicon, sizes: "32x32", type: "image/png" },
        { url: icon192, sizes: "192x192", type: "image/png" },
      ],
      apple: [{ url: apple, sizes: "180x180", type: "image/png" }],
    },
    openGraph: {
      locale: "es_SV",
      type: "website",
      title: TITLE,
      description: DESCRIPTION,
      url: "/",
      siteName: "Club de Lobos",
      images: [{ url: og, width: 1200, height: 630, type: "image/png", alt: "Club de Lobos" }],
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [og] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-SV" className={`${montserrat.variable} h-full scroll-smooth antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
