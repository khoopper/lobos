import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { BookOpen, CalendarDays, GalleryHorizontalEnd, House, Images, LayoutDashboard, LogOut, MessageSquareText, Settings, Users } from "lucide-react";
import { requireRole } from "@/lib/auth/dal";
import { SITE_PALETTES, type SitePaletteId } from "@/lib/site-palettes";
import { logout } from "../login/actions";

const ADMIN_NAV = [
  { href: "/admin", label: "Panel", icon: LayoutDashboard },
  { href: "/admin/settings", label: "Ajustes del sitio", icon: Settings },
  { href: "/admin/hero", label: "Portada", icon: Images },
  { href: "/admin/tours", label: "Aventuras y salidas", icon: CalendarDays },
  { href: "/admin/sections", label: "Secciones", icon: BookOpen },
  { href: "/admin/gallery", label: "Galería", icon: GalleryHorizontalEnd },
  { href: "/admin/reviews", label: "Testimonios", icon: MessageSquareText },
  { href: "/admin/bookings", label: "Reservas", icon: House },
  { href: "/admin/users", label: "Usuarios", icon: Users },
] as const;

const WORKER_NAV = [{ href: "/admin/bookings", label: "Reservas", icon: House }] as const;

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const [session, cookieStore] = await Promise.all([requireRole(["admin", "worker"]), cookies()]);
  const nav = session.role === "admin" ? ADMIN_NAV : WORKER_NAV;
  const requestedPalette = cookieStore.get("lobos-site-palette")?.value;
  const paletteId: SitePaletteId = requestedPalette && requestedPalette in SITE_PALETTES
    ? requestedPalette as SitePaletteId
    : "original";
  const palette = SITE_PALETTES[paletteId].colors;

  return (
    <div
      id="admin-shell"
      className="min-h-dvh bg-[var(--gn-palette-8)] lg:grid lg:grid-cols-[252px_minmax(0,1fr)]"
      style={{
        "--gn-palette-1": palette[1],
        "--gn-palette-2": palette[2],
        "--gn-palette-3": palette[3],
        "--gn-palette-5": palette[5],
        "--gn-palette-7": palette[7],
        "--gn-palette-8": palette[8],
      } as React.CSSProperties}
    >
      <aside className="z-40 border-b border-white/10 bg-[var(--gn-palette-2)] text-white lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:border-b-0 lg:border-r lg:border-white/10">
        <div className="flex h-[76px] items-center gap-3 border-b border-white/10 px-5 lg:h-auto lg:px-6 lg:py-6">
          <Image src="/brand/lobos/logo-white-640.png" alt="" width={640} height={640} className="h-11 w-11 object-contain" />
          <div className="min-w-0">
            <p className="text-sm font-extrabold tracking-[.08em]">CLUB DE LOBOS</p>
            <p className="text-[11px] text-white/55">Administración</p>
          </div>
          <Link href="/" target="_blank" className="ml-auto rounded-lg p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white" aria-label="Abrir sitio"><House className="h-4 w-4" /></Link>
          <form action={logout} className="lg:hidden">
            <button type="submit" className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white" aria-label="Cerrar sesión"><LogOut className="h-4 w-4" /></button>
          </form>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 py-3 lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-y-auto lg:px-4 lg:py-5">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white">
                <Icon className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden border-t border-white/10 p-4 lg:block">
          <p className="mb-3 truncate px-2 text-[11px] text-white/50">{session.email}</p>
          <form action={logout}>
            <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-white/75 transition-colors hover:bg-white/10 hover:text-white"><LogOut className="h-4 w-4" />Cerrar sesión</button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-9 xl:px-12">
        <div className="mx-auto w-full max-w-[1180px]">{children}</div>
      </main>
    </div>
  );
}
