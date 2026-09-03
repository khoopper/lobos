import Link from "next/link";
import { requireRole } from "@/lib/auth/dal";
import { logout } from "../login/actions";

const ADMIN_NAV = [
  { href: "/admin", label: "Panel" },
  { href: "/admin/settings", label: "Ajustes del sitio" },
  { href: "/admin/hero", label: "Portada" },
  { href: "/admin/tours", label: "Próximas salidas" },
  { href: "/admin/sections", label: "Secciones" },
  { href: "/admin/gallery", label: "Galería" },
  { href: "/admin/reviews", label: "Reseñas" },
  { href: "/admin/bookings", label: "Reservas" },
  { href: "/admin/users", label: "Usuarios" },
] as const;

const WORKER_NAV = [{ href: "/admin/bookings", label: "Reservas" }] as const;

/**
 * Everything under this route group requires a session (any role reaches
 * this far — worker vs. admin narrowing happens per-page via
 * `requireRole([...])`, see `src/lib/auth/dal.ts`). `/admin/login` is a
 * sibling route OUTSIDE this group, so it is never wrapped by this gate.
 */
export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole(["admin", "worker"]);
  const nav = session.role === "admin" ? ADMIN_NAV : WORKER_NAV;

  return (
    <div className="flex min-h-screen w-full bg-[var(--gn-palette-8)]">
      <aside className="flex w-60 shrink-0 flex-col gap-1 bg-[var(--gn-palette-1)] p-4">
        <p className="mb-4 text-sm font-bold text-white">Guía Natours</p>
        <nav className="flex flex-1 flex-col gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm text-white transition-colors hover:bg-[var(--gn-palette-2)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-4 border-t border-white/20 pt-4">
          <p className="mb-2 truncate text-xs text-white/70">{session.email}</p>
          <form action={logout}>
            <button type="submit" className="w-full rounded-lg bg-white/10 px-3 py-2 text-left text-sm text-white">
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
