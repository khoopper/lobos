import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Club de Lobos",
    short_name: "Lobos",
    description: "Aventuras, camping y montaña con Club de Lobos.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f3eb",
    theme_color: "#1b3a2d",
    lang: "es-SV",
    icons: [
      { src: "/brand/lobos/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/lobos/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/brand/lobos/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
