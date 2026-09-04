"use client";

import { useState, useTransition } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { deleteTour, reorderTours, upsertTour } from "./actions";

export interface TourRow {
  id: string; slug: string; title: string; price: string; currency_symbol: string; departure_start: string; departure_end: string | null;
  image_url: string; image_w: number; image_h: number; hover_image_url: string | null; hover_image_w: number | null; hover_image_h: number | null; button_label: string; is_published: boolean;
}

const inputCls = "admin-input h-10 px-3";
const EMPTY: Omit<TourRow, "id"> = { slug: "", title: "", price: "Consultar", currency_symbol: "", departure_start: "", departure_end: null, image_url: "", image_w: 0, image_h: 0, hover_image_url: null, hover_image_w: null, hover_image_h: null, button_label: "Reservar", is_published: true };

function slugify(text: string) { return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) { return <label className={`flex min-w-0 flex-col gap-1.5 ${className}`}><span className="text-xs font-bold text-[var(--gn-palette-3)]">{label}</span>{children}</label>; }

function TourEditor({ tour, onDeleted }: { tour: TourRow | null; onDeleted?: () => void }) {
  const [form, setForm] = useState(tour ?? EMPTY);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function save() {
    setMessage(null);
    startTransition(async () => {
      const result = await upsertTour({ id: tour?.id, slug: form.slug || slugify(form.title), title: form.title, price: form.price, currencySymbol: form.currency_symbol, departureStart: form.departure_start, departureEnd: form.departure_end || null, imageUrl: form.image_url, imageW: form.image_w, imageH: form.image_h, hoverImageUrl: form.hover_image_url, hoverImageW: form.hover_image_w, hoverImageH: form.hover_image_h, buttonLabel: form.button_label, isPublished: form.is_published });
      if (result.error) setMessage(result.error); else if (!tour) window.location.reload(); else setMessage("Cambios publicados.");
    });
  }
  function remove() { if (!tour || !window.confirm("¿Eliminar esta salida?")) return; startTransition(async () => { const result = await deleteTour(tour.id); if (result.error) setMessage(result.error); else onDeleted?.(); }); }

  return (
    <article className="admin-card grid gap-5 p-5 lg:grid-cols-[250px_minmax(0,1fr)]">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
        <ImageUploader bucket="media" label="Imagen principal" value={form.image_w ? { url: form.image_url, width: form.image_w, height: form.image_h } : null} onChange={(image) => setForm((current) => ({ ...current, image_url: image.url, image_w: image.width, image_h: image.height }))} previewClassName="aspect-[4/5] w-full rounded-xl object-cover" />
        <ImageUploader bucket="media" label="Imagen secundaria (opcional)" value={form.hover_image_w && form.hover_image_url ? { url: form.hover_image_url, width: form.hover_image_w, height: form.hover_image_h! } : null} onChange={(image) => setForm((current) => ({ ...current, hover_image_url: image.url, hover_image_w: image.width, hover_image_h: image.height }))} previewClassName="aspect-[4/3] w-full rounded-xl object-cover lg:aspect-[16/7]" />
      </div>
      <div className="grid min-w-0 content-start gap-4 sm:grid-cols-2">
        <Field label="Nombre de la aventura" className="sm:col-span-2"><input className={inputCls} value={form.title} onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))} /></Field>
        <Field label="Identificador"><input className={inputCls} value={form.slug} placeholder={slugify(form.title) || "rumbo-a-uyuni"} onChange={(e) => setForm((current) => ({ ...current, slug: e.target.value }))} /></Field>
        <div className="grid grid-cols-[72px_1fr] gap-2"><Field label="Moneda"><input className={inputCls} value={form.currency_symbol} onChange={(e) => setForm((current) => ({ ...current, currency_symbol: e.target.value }))} placeholder="$" /></Field><Field label="Precio"><input className={inputCls} value={form.price} onChange={(e) => setForm((current) => ({ ...current, price: e.target.value }))} /></Field></div>
        <Field label="Fecha de salida"><input type="date" className={inputCls} value={form.departure_start} onChange={(e) => setForm((current) => ({ ...current, departure_start: e.target.value }))} /></Field>
        <Field label="Fecha final (opcional)"><input type="date" className={inputCls} value={form.departure_end ?? ""} onChange={(e) => setForm((current) => ({ ...current, departure_end: e.target.value || null }))} /></Field>
        <Field label="Texto del botón"><input className={inputCls} value={form.button_label} onChange={(e) => setForm((current) => ({ ...current, button_label: e.target.value }))} /></Field>
        <div className="flex items-end"><label className="flex h-10 items-center gap-2 text-xs font-semibold text-[var(--gn-palette-3)]"><input type="checkbox" checked={form.is_published} onChange={(e) => setForm((current) => ({ ...current, is_published: e.target.checked }))} />Publicado</label></div>
        <div className="flex flex-wrap items-center justify-end gap-2 sm:col-span-2"><button type="button" onClick={save} disabled={pending} className="gn-button disabled:opacity-50">{pending ? "Guardando…" : tour ? "Guardar" : "Agregar salida"}</button>{tour ? <button type="button" onClick={remove} disabled={pending} aria-label="Eliminar" className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 text-red-600"><Trash2 className="h-4 w-4" /></button> : null}</div>
        {message ? <p className={`text-xs font-semibold sm:col-span-2 ${message.includes("publicados") ? "text-emerald-700" : "text-red-600"}`}>{message}</p> : null}
      </div>
    </article>
  );
}

export function ToursManager({ tours: initial }: { tours: TourRow[] }) {
  const [tours, setTours] = useState(initial); const [, startTransition] = useTransition();
  function move(index: number, delta: number) { const next = [...tours]; const target = index + delta; if (target < 0 || target >= next.length) return; [next[index], next[target]] = [next[target], next[index]]; setTours(next); startTransition(() => { void reorderTours(next.map((tour) => tour.id)); }); }
  return <div className="flex flex-col gap-5">{tours.map((tour, index) => <div key={tour.id} className="relative"><div className="absolute right-3 top-3 z-10 flex gap-1"><button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Subir" className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 shadow disabled:opacity-30"><ChevronUp className="h-4 w-4" /></button><button type="button" onClick={() => move(index, 1)} disabled={index === tours.length - 1} aria-label="Bajar" className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 shadow disabled:opacity-30"><ChevronDown className="h-4 w-4" /></button></div><TourEditor tour={tour} onDeleted={() => setTours((current) => current.filter((item) => item.id !== tour.id))} /></div>)}<div className="mt-3"><h2 className="mb-3 text-base font-extrabold text-[var(--gn-palette-3)]">Nueva salida</h2><TourEditor tour={null} /></div></div>;
}
