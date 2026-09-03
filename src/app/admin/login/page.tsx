import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Ingresar — Guía Natours" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[var(--gn-palette-8)] px-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-xl font-bold text-[var(--gn-palette-3)]">Guía Natours — Administración</h1>
        <LoginForm next={next} />
      </div>
    </div>
  );
}
