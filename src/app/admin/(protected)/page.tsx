import Link from "next/link";
import { CalendarDays, ImageIcon, Images, Settings } from "lucide-react";
import { requireRole } from "@/lib/auth/dal";

const SHORTCUTS = [
  { href: "/admin/settings", label: "Marca y contacto", description: "Logo, favicon, teléfonos, redes y colores.", icon: Settings },
  { href: "/admin/hero", label: "Portada", description: "Diapositivas, textos y llamados a la acción.", icon: Images },
  { href: "/admin/tours", label: "Aventuras", description: "Fechas, precios y disponibilidad visible.", icon: CalendarDays },
  { href: "/admin/gallery", label: "Galería", description: "Fotografías de rutas y experiencias.", icon: ImageIcon },
] as const;

export default async function AdminDashboardPage() {
  await requireRole(["admin"]);
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--gn-palette-1)]">Club de Lobos</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--gn-palette-3)]">Panel de contenido</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--gn-palette-5)]">Administra lo que aparece en el sitio. Cada módulo usa controles compactos y guarda únicamente su propia sección.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
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
