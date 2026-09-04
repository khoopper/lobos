import type { Metadata } from "next";
import Image from "next/image";
import { getGalleryItems, getSiteSettings } from "@/lib/queries/site-content";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Ingresar", robots: { index: false, follow: false } };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const [{ next }, settings, gallery] = await Promise.all([
    searchParams,
    getSiteSettings(),
    getGalleryItems(),
  ]);
  const backdrop = gallery[0] ?? null;

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[var(--gn-palette-2)] px-4"
      style={{
        "--gn-palette-1": settings.palette[1],
        "--gn-palette-2": settings.palette[2],
        "--gn-palette-3": settings.palette[3],
        "--gn-palette-5": settings.palette[5],
        "--gn-palette-7": settings.palette[7],
        "--gn-palette-8": settings.palette[8],
      } as React.CSSProperties}
    >
      {backdrop ? (
        <Image
          src={backdrop.full}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-[var(--gn-palette-2)]/85" />

      <div className="relative flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur-sm">
        <Image src="/brand/lobos/logo-black-640.png" alt="Club de Lobos" width={640} height={640} priority className="h-20 w-20 object-contain" />
        <div className="text-center">
          <h1 className="text-xl font-bold text-[var(--gn-palette-3)]">Club de Lobos</h1>
          <p className="mt-1 text-sm text-[var(--gn-palette-5)]">Panel de administración</p>
        </div>
        <LoginForm next={next} />
      </div>
    </div>
  );
}
