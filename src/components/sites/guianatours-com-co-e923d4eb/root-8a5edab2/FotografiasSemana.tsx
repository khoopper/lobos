import Image from "next/image";
import type { FotografiasBlock } from "@/lib/queries/site-content";
import type { GalleryItem } from "@/types/guianatours-com-co-e923d4eb";

/**
 * Sections 60df0cd + 48229f1 — the "Fotografías de la semana" heading and the
 * Elementor justified gallery below it.
 *
 * Elementor settings: gallery_layout "justified", ideal_row_height 300px
 * (150px on tablet/mobile), gap 10px, link_to "file", overlay_background "yes",
 * content_hover_animation "fade-in".
 *
 * The layout is reproduced with the flexbox justified-row technique: each item
 * grows in proportion to its aspect ratio, so rows fill the available width at
 * roughly the ideal row height without needing the e-gallery script.
 *
 * NOTE: this gallery is collapsed to 21px on the live site because Elementor's
 * e-gallery layout script never runs there. Building it as designed is a
 * deliberate deviation — see ARTIFACT_MANIFEST.md.
 */
export function FotografiasSemana({ block, gallery }: { block: FotografiasBlock; gallery: GalleryItem[] }) {
  return (
    <>
      <section id="galeria" className="scroll-mt-4 px-5 pb-[10px] pt-16">
        <div className="mx-auto max-w-[1140px]">
          <div className="gn-widget-wrap">
            <h2 className="mb-3 text-center text-2xl leading-6 font-bold text-[var(--gn-palette-3)]">
              {block.heading}
            </h2>
            <p className="m-0 text-center text-[17px] leading-[27.2px] font-normal text-[var(--gn-palette-5)]">
              {block.body}
            </p>
          </div>
        </div>
      </section>

      <section className="px-[10px]">
        <div className="flex flex-wrap gap-[10px] [--gn-row-h:150px] min-[1025px]:[--gn-row-h:300px]">
          {gallery.map((item) => {
            const ratio = item.width / item.height;
            return (
              <a
                key={item.id}
                href={item.full}
                target="_blank"
                rel="noopener noreferrer"
                title={item.title}
                className="group relative block h-[var(--gn-row-h)] overflow-hidden"
                style={{
                  flexGrow: ratio * 100,
                  flexBasis: `calc(var(--gn-row-h) * ${ratio})`,
                }}
              >
                <Image
                  src={item.thumb}
                  alt={item.title}
                  width={item.width}
                  height={item.height}
                  className="h-full w-full object-cover"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              </a>
            );
          })}
        </div>
      </section>
    </>
  );
}
