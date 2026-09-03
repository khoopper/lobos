import { requireRole } from "@/lib/auth/dal";

/** Dashboard is admin-only — a worker session lands on /admin/bookings instead (see requireRole). */
export default async function AdminDashboardPage() {
  await requireRole(["admin"]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--gn-palette-3)]">Panel</h1>
      <p className="mt-2 text-[var(--gn-palette-5)]">
        Desde aquí puedes editar todo el contenido del sitio: portada, salidas, secciones, galería,
        reseñas, ajustes generales y usuarios. Las reservas de clientes se ven en &quot;Reservas&quot;.
      </p>
    </div>
  );
}
