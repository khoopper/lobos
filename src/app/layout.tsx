import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lobos-chi.vercel.app";
const BRAND = "/brand/lobos";
const TITLE = "Club de Lobos | Aventuras desde El Salvador";
const DESCRIPTION = "Senderismo, camping, volcanes y viajes para vivir nuevas aventuras con la manada.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  icons: {
    icon: [
      { url: `${BRAND}/favicon-32.png`, sizes: "32x32", type: "image/png" },
      { url: `${BRAND}/icon-192.png`, sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: `${BRAND}/apple-touch-icon.png`, sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    locale: "es_SV",
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Club de Lobos",
    images: [{ url: `${BRAND}/og-image.png`, width: 1200, height: 630, type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-SV" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
