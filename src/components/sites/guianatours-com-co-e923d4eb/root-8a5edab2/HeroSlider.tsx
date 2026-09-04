"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@/components/sites/guianatours-com-co-e923d4eb/shared/icons";
import { track } from "@/lib/analytics/track";
import type { HeroSlide } from "@/types/guianatours-com-co-e923d4eb";

/** Elementor Slides widget settings, verbatim from data-settings. */
const AUTOPLAY_SPEED = 5000;
const TRANSITION_SPEED = 500;

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  /** `pause_on_interaction: "yes"` — autoplay stops for good after any arrow click. */
  const [stopped, setStopped] = useState(false);
  const count = slides.length;
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Guard against an admin deleting every slide — count === 0 would make the
    // modulo below divide by zero and spin the interval on a NaN index forever.
    if (paused || stopped || count === 0) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_SPEED);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, stopped, count]);

  const go = useCallback(
    (delta: number) => {
      if (count === 0) return;
      setStopped(true);
      setIndex((i) => (i + delta + count) % count);
    },
    [count],
  );

  if (count === 0) return null;

  // Derived, not stored: if the slide count shrinks (an admin deletes slides)
  // while `index` still points past the new end, wrap it back in bounds at
  // render time instead of clamping via a setState-in-effect.
  const safeIndex = index % count;

  return (
    <section
      className="relative h-[700px] w-full overflow-hidden bg-[var(--gn-palette-2)] max-[1024px]:h-[450px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Destinos destacados"
    >
      <div
        className="flex h-full w-full"
        style={{
          transform: `translateX(-${safeIndex * 100}%)`,
          transition: `transform ${TRANSITION_SPEED}ms ease`,
        }}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className="relative h-full w-full shrink-0"
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${count}`}
            aria-hidden={i !== safeIndex}
          >
            {/* .swiper-slide-bg — cover, centred, no overlay tint. A real
                next/image (not a CSS background-image) so it's served
                resized/compressed instead of the raw upload — this is what
                keeps clicking through slides feeling instant. */}
            <div className="absolute inset-0 bg-[var(--gn-palette-2)]" role="img" aria-label={slide.heading}>
              <Image
                src={slide.image}
                alt=""
                fill
                priority={i === 0}
                loading={i === 0 ? undefined : "lazy"}
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
            {/* .swiper-slide-inner — the whole slide is one link */}
            <a
              href={slide.href}
              tabIndex={i === safeIndex ? undefined : -1}
              onClick={() => track("cta_click", slide.heading)}
              className="absolute inset-0 mx-auto flex max-w-[1280px] items-end justify-start p-[50px] text-left text-white transition-all duration-100 ease-linear max-[767px]:p-[30px]"
            >
              <div className="w-[600px] max-w-full">
                <div className="mb-[5px] text-[35px] leading-[35px] font-bold text-white max-[767px]:text-[23px] max-[767px]:leading-[23px]">
                  {slide.heading}
                </div>
                <div className="mb-[30px] text-[17px] leading-[23.8px] font-normal text-white max-[767px]:text-[13px] max-[767px]:leading-[18.2px]">
                  {slide.description}
                </div>
                <div className="gn-button">{slide.buttonLabel}</div>
              </div>
            </a>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Anterior"
        className="absolute left-[10px] top-1/2 z-[1] flex h-[25px] w-[25px] -translate-y-[12.5px] items-center justify-center text-[rgba(237,237,237,0.9)] transition-all"
      >
        <ChevronLeftIcon className="h-[25px] w-[25px]" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Siguiente"
        className="absolute right-[10px] top-1/2 z-[1] flex h-[25px] w-[25px] -translate-y-[12.5px] items-center justify-center text-[rgba(237,237,237,0.9)] transition-all"
      >
        <ChevronRightIcon className="h-[25px] w-[25px]" />
      </button>
    </section>
  );
}
