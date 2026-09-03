import { ProductCard } from "./ProductCard";
import type { ProductCard as ProductCardData } from "@/types/guianatours-com-co-e923d4eb";

/** Section a3125aa — cream band with the six upcoming-departure product cards. */
export function ProximosDestinos({ tours }: { tours: ProductCardData[] }) {
  return (
    <section className="relative bg-[var(--gn-palette-8)] px-5 pb-10 pt-[10px]">
      <div className="mx-auto flex max-w-[1140px] flex-col">
        <div className="gn-widget-wrap flex flex-col">
          {/* Elementor heading widget carries margin-bottom: 20px on top of the h2's 12px */}
          <div className="mb-5">
            <h2 className="mb-3 text-center text-2xl leading-6 font-bold text-[var(--gn-palette-3)]">
              Nuestros próximos destinos
            </h2>
          </div>
          <ul className="mb-[17px] grid list-none grid-cols-1 gap-10 p-0 min-[576px]:grid-cols-2 min-[1025px]:grid-cols-3">
            {tours.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
