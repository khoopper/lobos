import { requireRole } from "@/lib/auth/dal";
import { getSiteSettings } from "@/lib/queries/site-content";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage() {
  const [, settings] = await Promise.all([requireRole(["admin"]), getSiteSettings()]);

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-[var(--gn-palette-3)]">Ajustes del sitio</h1>
      <p className="mt-1 text-sm text-[var(--gn-palette-5)]">
        Marca, contacto, redes sociales, colores y textos generales.
      </p>
      <div className="mt-6">
        <SettingsForm initial={settings} />
      </div>
    </div>
  );
}
