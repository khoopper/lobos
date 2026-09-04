import { requireRole } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { CreateUserForm } from "./CreateUserForm";

export default async function UsersPage() {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, role, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-[var(--gn-palette-3)]">Usuarios</h1>
      <p className="mt-1 text-sm text-[var(--gn-palette-5)]">
        Crea cuentas para tu equipo. Los administradores pueden editar todo el sitio; los
        trabajadores únicamente ven la lista de reservas.
      </p>

      <div className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
        <div className="admin-card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 text-[var(--gn-palette-5)]">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Rol</th>
              </tr>
            </thead>
            <tbody>
              {profiles?.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-[var(--gn-palette-3)]">{p.full_name ?? "—"}</td>
                  <td className="px-4 py-3 text-[var(--gn-palette-5)]">
                    {p.role === "admin" ? "Administrador" : "Trabajador"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CreateUserForm />
      </div>
    </div>
  );
}
