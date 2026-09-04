import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Ingresar — Club de Lobos" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[var(--gn-palette-8)] px-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl bg-white p-8 shadow-lg">
        <Image src="/brand/lobos/logo-black-640.png" alt="Club de Lobos" width={640} height={640} priority className="h-20 w-20 object-contain" />
        <h1 className="text-xl font-bold text-[var(--gn-palette-3)]">Club de Lobos — Administración</h1>
        <LoginForm next={next} />
      </div>
    </div>
  );
}
