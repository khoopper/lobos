import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No `output: "standalone"` — that's for self-hosted Node/Docker. Vercel
  // builds and traces its own serverless output, and standalone mode
  // conflicts with it (missing .next/next-server.js.nft.json at deploy time).
  images: {
    remotePatterns: [
      // Supabase Storage — admin-uploaded logos, tour photos, gallery images.
      // Wildcarded so it keeps working across any Supabase project ref.
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default nextConfig;
