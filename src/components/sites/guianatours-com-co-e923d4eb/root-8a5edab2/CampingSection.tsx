import Image from "next/image";
import type { CampingBlock } from "@/lib/queries/site-content";

/**
 * Section 11044c1 — a 66/33 split. The photograph's wrapper carries
 * `margin-top: -50px` so it overlaps the section above; that reset to 0 below 768px.
 * At <=1024px the container goes full-bleed.
 */
export function CampingSection({ block }: { block: CampingBlock }) {
  return (
    <section className="relative">
      <div className="mx-auto flex max-w-[1140px] flex-col max-[1024px]:max-w-none min-[768px]:flex-row">
        <div className="flex min-[768px]:w-2/3">
          <div className="-mt-[50px] w-full max-[767px]:mt-0">
            {block.image ? (
              <Image
                src={block.image.src}
                alt=""
                width={block.image.width}
                height={block.image.height}
                className="block h-auto w-full"
                sizes="(max-width: 767px) 100vw, 66vw"
              />
            ) : null}
          </div>
        </div>

        <div className="flex min-[768px]:w-1/3">
          <div className="flex w-full items-center bg-[var(--gn-palette-7)] px-5 py-10 transition-[background,border,border-radius,box-shadow] duration-300">
            <div>
              <h2 className="mb-3 text-2xl leading-6 font-bold text-[var(--gn-palette-3)]">{block.heading}</h2>
              <p className="m-0 text-[17px] leading-[27.2px] font-normal text-[var(--gn-palette-5)]">
                {block.body}
              </p>
              <div className="mt-[30px]">
                <a href={block.buttonHref} className="gn-button">
                  {block.buttonLabel}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
