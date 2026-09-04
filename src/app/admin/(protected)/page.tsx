import Link from "next/link";
import { CalendarDays, ImageIcon, Images, Settings } from "lucide-react";
import { requireRole } from "@/lib/auth/dal";
import { getDashboardMetrics } from "@/lib/queries/analytics";

const SHORTCUTS = [
  { href: "/admin/settings", label: "Marca y contacto", description: "Logo, favicon, teléfonos, redes y colores.", icon: Settings },
  { href: "/admin/hero", label: "Portada", description: "Diapositivas, textos y llamados a la acción.", icon: Images },
  { href: "/admin/tours", label: "Aventuras", description: "Fechas, precios y disponibilidad visible.", icon: CalendarDays },
  { href: "/admin/gallery", label: "Galería", description: "Fotografías de rutas y experiencias.", icon: ImageIcon },
] as const;

const WEEKDAY = new Intl.DateTimeFormat("es-SV", { weekday: "short", timeZone: "UTC" });

function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="admin-card p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-[var(--gn-palette-5)]">{label}</p>
      <p className="mt-2 text-3xl font-extrabold text-[var(--gn-palette-3)]">{value}</p>
      {hint ? <p className="mt-1 text-xs text-[var(--gn-palette-5)]">{hint}</p> : null}
    </div>
  );
}

function VisitsChart({ dailyVisits }: { dailyVisits: { date: string; count: number }[] }) {
  const max = Math.max(1, ...dailyVisits.map((d) => d.count));
  return (
    <div className="admin-card p-5 sm:col-span-2">
      <p className="text-xs font-bold uppercase tracking-wide text-[var(--gn-palette-5)]">Visitas — últimos 7 días</p>
      <div className="mt-4 flex h-32 items-end gap-3">
        {dailyVisits.map((day) => (
          <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-24 w-full items-end">
              <div
                className="w-full rounded-t-md bg-[var(--gn-palette-1)]"
                style={{ height: `${Math.max(4, (day.count / max) * 100)}%` }}
                title={`${day.count} visitas`}
              />
            </div>
            <span className="text-[10px] font-semibold uppercase text-[var(--gn-palette-5)]">{WEEKDAY.format(new Date(`${day.date}T00:00:00Z`))}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RankedList({ title, items, emptyLabel }: { title: string; items: { label: string; count: number }[]; emptyLabel: string }) {
  return (
    <div className="admin-card p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-[var(--gn-palette-5)]">{title}</p>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-[var(--gn-palette-5)]">{emptyLabel}</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.label} className="flex items-center justify-between gap-3 text-sm">
              <span className="truncate text-[var(--gn-palette-3)]">{item.label}</span>
              <span className="shrink-0 rounded-full bg-[var(--gn-palette-8)] px-2 py-0.5 text-xs font-bold text-[var(--gn-palette-1)]">{item.count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default async function AdminDashboardPage() {
  await requireRole(["admin"]);
  const metrics = await getDashboardMetrics();

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--gn-palette-1)]">Club de Lobos</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--gn-palette-3)]">Panel de contenido</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--gn-palette-5)]">Administra lo que aparece en el sitio. Cada módulo usa controles compactos y guarda únicamente su propia sección.</p>

      {!metrics.available ? (
        <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold leading-5 text-amber-800">
          Las métricas todavía no están activas: falta aplicar <code className="rounded bg-amber-100 px-1">supabase/migrations/0003_analytics.sql</code> en el editor SQL de Supabase.
        </p>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Visitas hoy" value={metrics.visitsToday} />
        <StatCard label="Visitas · 7 días" value={metrics.visits7d} />
        <StatCard label="Reservas pendientes" value={metrics.pendingBookings} hint="Por confirmar o rechazar" />
        <StatCard label="Salidas publicadas" value={metrics.publishedTours} hint="Visibles en la portada" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <VisitsChart dailyVisits={metrics.dailyVisits} />
        <RankedList title="Salidas más vistas · 7 días" items={metrics.topTours} emptyLabel="Sin clics todavía." />
        <RankedList title="Botones más usados · 7 días" items={metrics.topCtas} emptyLabel="Sin clics todavía." />
        <StatCard label="Clics en redes sociales · 7 días" value={metrics.socialClicks7d} />
      </div>

      <h2 className="mt-8 text-lg font-extrabold text-[var(--gn-palette-3)]">Accesos rápidos</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {SHORTCUTS.map((item) => { const Icon = item.icon; return (
          <Link key={item.href} href={item.href} className="admin-card group flex items-start gap-4 p-5 transition-transform hover:-translate-y-0.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--gn-palette-1)] text-white"><Icon className="h-5 w-5" /></span>
            <span><strong className="block text-sm text-[var(--gn-palette-3)]">{item.label}</strong><span className="mt-1 block text-xs leading-5 text-[var(--gn-palette-5)]">{item.description}</span></span>
          </Link>
        ); })}
      </div>
    </div>
  );
}
