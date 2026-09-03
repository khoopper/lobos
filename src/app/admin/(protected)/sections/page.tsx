import { requireRole } from "@/lib/auth/dal";
import { getContentBlocks } from "@/lib/queries/site-content";
import { SectionsManager } from "./SectionsManager";

export default async function SectionsPage() {
  await requireRole(["admin"]);
  const blocks = await getContentBlocks();

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--gn-palette-3)]">Secciones</h1>
      <p className="mt-1 text-sm text-[var(--gn-palette-5)]">
        Los tres bloques de contenido fijo del sitio: guías, camping y fotografías de la semana.
      </p>
      <div className="mt-6">
        <SectionsManager guias={blocks.guias} camping={blocks.camping} fotografias={blocks.fotografias} />
      </div>
    </div>
  );
}
