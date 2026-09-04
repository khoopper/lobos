"use client";

import { useState, useTransition } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { deleteHeroSlide, reorderHeroSlides, upsertHeroSlide } from "./actions";

export interface HeroSlideRow {
  id: string; image_url: string; image_w: number; image_h: number; heading: string; description: string; button_label: string; href: string; is_published: boolean;
}

const inputCls = "admin-input h-10 px-3";
const EMPTY: Omit<HeroSlideRow, "id"> = { image_url: "", image_w: 0, image_h: 0, heading: "", description: "", button_label: "Ver aventuras", href: "/#proximas-aventuras", is_published: true };

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return <label className={`flex min-w-0 flex-col gap-1.5 ${className}`}><span className="text-xs font-bold text-[var(--gn-palette-3)]">{label}</span>{children}</label>;
}

function SlideEditor({ slide, onDeleted }: { slide: HeroSlideRow | null; onDeleted?: () => void }) {
  const [form, setForm] = useState(slide ?? EMPTY);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function save() {
    setMessage(null);
    startTransition(async () => {
      const result = await upsertHeroSlide({ id: slide?.id, imageUrl: form.image_url, imageW: form.image_w, imageH: form.image_h, heading: form.heading, description: form.description, buttonLabel: form.button_label, href: form.href, isPublished: form.is_published });
      if (result.error) setMessage(result.error);
      else if (!slide) window.location.reload();
      else setMessage("Cambios publicados.");
    });
  }

  function remove() {
    if (!slide || !window.confirm("¿Eliminar esta diapositiva?")) return;
    startTransition(async () => { const result = await deleteHeroSlide(slide.id); if (result.error) setMessage(result.error); else onDeleted?.(); });
  }

  return (
    <article className="admin-card grid gap-5 p-5 md:grid-cols-[220px_minmax(0,1fr)]">
      <ImageUploader bucket="media" label="Imagen" value={form.image_w ? { url: form.image_url, width: form.image_w, height: form.image_h } : null} onChange={(image) => setForm((current) => ({ ...current, image_url: image.url, image_w: image.width, image_h: image.height }))} previewClassName="aspect-[4/5] w-full rounded-xl object-cover" />
      <div className="grid min-w-0 gap-4 sm:grid-cols-2">
        <Field label="Título" className="sm:col-span-2"><input className={inputCls} value={form.heading} onChange={(e) => setForm((current) => ({ ...current, heading: e.target.value }))} /></Field>
        <Field label="Descripción" className="sm:col-span-2"><textarea className="admin-input min-h-20 resize-y px-3 py-2" value={form.description} onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))} /></Field>
        <Field label="Texto del botón"><input className={inputCls} value={form.button_label} onChange={(e) => setForm((current) => ({ ...current, button_label: e.target.value }))} /></Field>
        <Field label="Enlace"><input className={inputCls} value={form.href} onChange={(e) => setForm((current) => ({ ...current, href: e.target.value }))} /></Field>
        <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-[var(--gn-palette-3)]"><input type="checkbox" checked={form.is_published} onChange={(e) => setForm((current) => ({ ...current, is_published: e.target.checked }))} />Visible en el sitio</label>
          <div className="flex gap-2"><button type="button" onClick={save} disabled={pending} className="gn-button disabled:opacity-50">{pending ? "Guardando…" : slide ? "Guardar" : "Agregar diapositiva"}</button>{slide ? <button type="button" onClick={remove} disabled={pending} aria-label="Eliminar" className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 text-red-600"><Trash2 className="h-4 w-4" /></button> : null}</div>
        </div>
        {message ? <p className={`text-xs font-semibold sm:col-span-2 ${message.includes("publicados") ? "text-emerald-700" : "text-red-600"}`}>{message}</p> : null}
      </div>
    </article>
  );
}

export function HeroSlidesManager({ slides: initial }: { slides: HeroSlideRow[] }) {
  const [slides, setSlides] = useState(initial);
  const [, startTransition] = useTransition();
  function move(index: number, delta: number) {
    const next = [...slides]; const target = index + delta; if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]]; setSlides(next);
    startTransition(() => { void reorderHeroSlides(next.map((slide) => slide.id)); });
  }
  return <div className="flex flex-col gap-5">{slides.map((slide, index) => <div key={slide.id} className="relative"><div className="absolute right-3 top-3 z-10 flex gap-1"><button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Subir" className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 shadow disabled:opacity-30"><ChevronUp className="h-4 w-4" /></button><button type="button" onClick={() => move(index, 1)} disabled={index === slides.length - 1} aria-label="Bajar" className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 shadow disabled:opacity-30"><ChevronDown className="h-4 w-4" /></button></div><SlideEditor slide={slide} onDeleted={() => setSlides((current) => current.filter((item) => item.id !== slide.id))} /></div>)}<div className="mt-3"><h2 className="mb-3 text-base font-extrabold text-[var(--gn-palette-3)]">Nueva diapositiva</h2><SlideEditor slide={null} /></div></div>;
}
