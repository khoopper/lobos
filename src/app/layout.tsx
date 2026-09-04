import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const ASSETS = "/sites/guianatours-com-co-e923d4eb/root-8a5edab2";

export const metadata: Metadata = {
  metadataBase: new URL("https://guianatours.com.co/"),
  title: "Guía Natours - Experiencia Inolvidables - Explora la Naturaleza",
  description:
    "Uno de nuestros destinos favoritos el el Parque Nacional Natural Chingaza, un lugar cargado de bosques, lagunas , páramo, venados y mucho más",
  icons: {
    icon: [
      { url: `${ASSETS}/brand/favicon-32.png`, sizes: "32x32" },
      { url: `${ASSETS}/brand/favicon-192.png`, sizes: "192x192" },
    ],
    apple: [{ url: `${ASSETS}/brand/apple-touch-icon.png`, sizes: "180x180" }],
  },
  openGraph: {
    locale: "es_ES",
    type: "website",
    title: "Guía Natours - Experiencia Inolvidables - Explora la Naturaleza",
    description:
      "Uno de nuestros destinos favoritos el el Parque Nacional Natural Chingaza, un lugar cargado de bosques, lagunas , páramo, venados y mucho más",
    url: "https://guianatours.com.co/",
    siteName: "Guía Natours",
    images: [{ url: `${ASSETS}/seo/og-image.jpeg`, width: 1500, height: 1000, type: "image/jpeg" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
