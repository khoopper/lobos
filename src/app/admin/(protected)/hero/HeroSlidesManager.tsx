"use client";

import { useState, useTransition } from "react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { deleteHeroSlide, reorderHeroSlides, upsertHeroSlide } from "./actions";

export interface HeroSlideRow {
  id: string;
  image_url: string;
  image_w: number;
  image_h: number;
  heading: string;
  description: string;
  button_label: string;
  href: string;
}

const inputCls = "h-10 rounded-lg border border-[#69727d] bg-white px-3 text-[15px] text-[#1f2124]";
const EMPTY: Omit<HeroSlideRow, "id"> = {
  image_url: "",
  image_w: 0,
  image_h: 0,
  heading: "",
  description: "",
  button_label: "Mira los próximos destinos",
  href: "https://guianatours.com.co/categoria-salidas/nuestros-proximos-destinos/",
};

function SlideEditor({
  slide,
  onSaved,
  onDeleted,
}: {
  slide: HeroSlideRow | null;
  onSaved: () => void;
  onDeleted?: () => void;
}) {
  const [form, setForm] = useState(slide ?? EMPTY);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function save() {
    setMessage(null);
    startTransition(async () => {
      const result = await upsertHeroSlide({
        id: slide?.id,
        imageUrl: form.image_url,
        imageW: form.image_w,
        imageH: form.image_h,
        heading: form.heading,
        description: form.description,
        buttonLabel: form.button_label,
        href: form.href,
      });
      if (result.error) setMessage(result.error);
      else {
        setMessage(null);
        onSaved();
        if (!slide) setForm(EMPTY);
      }
    });
  }

  function remove() {
    if (!slide) return;
    startTransition(async () => {
      const result = await deleteHeroSlide(slide.id);
      if (result.error) setMessage(result.error);
      else onDeleted?.();
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-white p-6 shadow">
      <ImageUploader
        bucket="media"
        value={form.image_w ? { url: form.image_url, width: form.image_w, height: form.image_h } : null}
        onChange={(img) => setForm((f) => ({ ...f, image_url: img.url, image_w: img.width, image_h: img.height }))}
        previewClassName="h-24 w-full max-w-sm rounded-lg object-cover"
      />
      <input
        className={inputCls}
        placeholder="Título"
        value={form.heading}
        onChange={(e) => setForm((f) => ({ ...f, heading: e.target.value }))}
      />
      <textarea
        className={inputCls + " h-20"}
        placeholder="Descripción"
        value={form.description}
        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
      />
      <input
        className={inputCls}
        placeholder="Texto del botón"
        value={form.button_label}
        onChange={(e) => setForm((f) => ({ ...f, button_label: e.target.value }))}
      />
      <input
        className={inputCls}
        placeholder="Enlace del botón"
        value={form.href}
        onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))}
      />
      {message ? <p className="text-sm text-red-600">{message}</p> : null}
      <div className="flex gap-2">
        <button type="button" onClick={save} disabled={pending} className="gn-button disabled:opacity-60">
          {pending ? "Guardando…" : slide ? "Guardar cambios" : "Agregar diapositiva"}
        </button>
        {slide ? (
          <button
            type="button"
            onClick={remove}
            disabled={pending}
            className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-600 disabled:opacity-60"
          >
            Eliminar
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function HeroSlidesManager({ slides: initial }: { slides: HeroSlideRow[] }) {
  const [slides, setSlides] = useState(initial);
  const [, startTransition] = useTransition();

  function move(index: number, delta: number) {
    const next = [...slides];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setSlides(next);
    startTransition(() => {
      void reorderHeroSlides(next.map((s) => s.id));
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {slides.map((slide, i) => (
        <div key={slide.id} className="flex items-start gap-2">
          <div className="flex flex-col gap-1 pt-6">
            <button
              type="button"
              onClick={() => move(i, -1)}
              disabled={i === 0}
              className="h-8 w-8 rounded border border-[#69727d] text-sm disabled:opacity-30"
              aria-label="Subir"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => move(i, 1)}
              disabled={i === slides.length - 1}
              className="h-8 w-8 rounded border border-[#69727d] text-sm disabled:opacity-30"
              aria-label="Bajar"
            >
              ↓
            </button>
          </div>
          <div className="flex-1">
            <SlideEditor
              slide={slide}
              onSaved={() => {}}
              onDeleted={() => setSlides((s) => s.filter((x) => x.id !== slide.id))}
            />
          </div>
        </div>
      ))}

      <div>
        <h2 className="mb-3 text-lg font-bold text-[var(--gn-palette-3)]">Agregar nueva diapositiva</h2>
        <SlideEditor slide={null} onSaved={() => window.location.reload()} />
      </div>
    </div>
  );
}
