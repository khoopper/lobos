import Image from "next/image";
import type { GuiasBlock } from "@/lib/queries/site-content";

/**
 * Section 56e43f8 — heading + CTA on the left, two photographs filling the rest.
 *
 * The three Elementor columns are NOT equal thirds: they measure 379.98 /
 * 374.97 / 381.20 of the 1140px container. Those exact widths are what make the
 * two photos (439×373 and 446×373) land on the same rendered height (318.6 and
 * 318.8), so they are reproduced verbatim rather than normalised to 1/3 each.
 */
const COLUMN_BASIS = ["33.332%", "32.892%", "33.439%"] as const;

export function GuiasExpertos({ block }: { block: GuiasBlock }) {
  return (
    <section id="nosotros" className="relative px-5 pt-[60px] max-[767px]:pt-10">
      <div className="mx-auto flex max-w-[1140px] flex-col min-[768px]:flex-row">
        {/* text column — vertically centred against the photos */}
        <div className="flex w-full min-[768px]:w-auto" style={{ flexBasis: COLUMN_BASIS[0] }}>
          <div className="gn-widget-wrap mb-[50px] flex w-full items-center max-[767px]:mb-5">
            {/* flex column so the h2's 12px margin cannot collapse out of the
                heading widget box — Elementor widgets are separate boxes */}
            <div className="flex flex-col items-start">
              {/* heading widget margin-bottom: 20px desktop, 10px below 768px */}
              <div className="mb-5 max-[767px]:mb-[10px]">
                <h2 className="mb-3 text-2xl leading-6 font-bold text-[var(--gn-palette-3)]">{block.heading}</h2>
              </div>
              <a href={block.buttonHref} className="gn-button">
                {block.buttonLabel}
              </a>
            </div>
          </div>
        </div>

        {block.images.map((image, i) => (
          <div
            key={image.src}
            className="flex w-full min-[768px]:w-auto"
            style={{ flexBasis: COLUMN_BASIS[i + 1] }}
          >
            <Image
              src={image.src}
              alt=""
              width={image.width}
              height={image.height}
              className="block h-auto w-full"
              sizes="(max-width: 767px) 100vw, 33vw"
              priority={i === 0}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
