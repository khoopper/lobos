import { ProductCard } from "./ProductCard";
import type { ProductCard as ProductCardData } from "@/types/guianatours-com-co-e923d4eb";

/** Section a3125aa — cream band with the six upcoming-departure product cards. */
export function ProximosDestinos({ tours }: { tours: ProductCardData[] }) {
  return (
    <section id="proximas-aventuras" className="scroll-mt-4 bg-[var(--gn-palette-8)] px-5 py-16">
      <div className="mx-auto flex max-w-[1140px] flex-col">
        <div className="gn-widget-wrap flex flex-col">
          <div className="mb-8">
            <p className="mb-3 text-center text-xs font-bold uppercase tracking-[.2em] text-[var(--gn-palette-1)]">Próxima salida confirmada</p>
            <h2 className="mb-3 text-center text-3xl leading-tight font-extrabold text-[var(--gn-palette-3)]">
              Aventuras de la manada
            </h2>
            <p className="mx-auto max-w-2xl text-center text-sm leading-6 text-[var(--gn-palette-5)]">Rutas para compartir, descubrir nuevos paisajes y vivir cada paso al máximo.</p>
          </div>
          <ul className="mx-auto mb-4 grid w-full max-w-[820px] list-none grid-cols-1 gap-8 p-0 min-[640px]:grid-cols-2">
            {tours.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
