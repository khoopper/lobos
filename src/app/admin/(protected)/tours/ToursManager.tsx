"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Activity, AlertTriangle, Camera, ChevronDown, ChevronUp, CircleDollarSign, Clock3, Compass,
  Gauge, Mountain, Route, TentTree, Thermometer, Trash2, TrendingUp, Trees,
  UsersRound, Waves,
} from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import {
  getDefaultTourDetail,
  TOUR_ICON_OPTIONS,
  type TourDetailCopy,
  type TourIconId,
} from "@/lib/tour-details";
import { reorderTours, upsertTour } from "./actions";

export interface TourRow {
  id: string;
  slug: string;
  title: string;
  price: string;
  currency_symbol: string;
  departure_start: string;
  departure_end: string | null;
  image_url: string;
  image_w: number;
  image_h: number;
  hover_image_url: string | null;
  hover_image_w: number | null;
  hover_image_h: number | null;
  button_label: string;
  is_published: boolean;
  details: TourDetailCopy;
}

const inputCls = "admin-input h-10 px-3";
const EMPTY: Omit<TourRow, "id"> = {
  slug: "", title: "", price: "Consultar", currency_symbol: "$", departure_start: "", departure_end: null,
  image_url: "", image_w: 0, image_h: 0, hover_image_url: null, hover_image_w: null, hover_image_h: null,
  button_label: "Ver salida", is_published: true, details: getDefaultTourDetail(""),
};

const ICONS: Record<TourIconId, typeof Activity> = {
  compass: Compass, activity: Activity, gauge: Gauge, clock: Clock3,
  mountain: Mountain, elevation: TrendingUp, temperature: Thermometer,
  trees: Trees, route: Route, people: UsersRound, price: CircleDollarSign,
  tent: TentTree, camera: Camera, waves: Waves,
};

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return <label className={`flex min-w-0 flex-col gap-1.5 ${className}`}><span className="text-xs font-bold text-[var(--gn-palette-3)]">{label}</span>{children}</label>;
}

function DeleteTourDialog({
  title,
  pending,
  error,
  onCancel,
  onConfirm,
}: {
  title: string;
  pending: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !pending) onCancel();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onCancel, pending]);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="delete-tour-title">
      <button type="button" aria-label="Cerrar confirmación" disabled={pending} onClick={onCancel} className="absolute inset-0 h-full w-full cursor-default bg-black/55 backdrop-blur-[2px]" />
      <div className="relative w-full max-w-md rounded-2xl border border-black/10 bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600"><AlertTriangle className="h-5 w-5" /></span>
          <div className="min-w-0">
            <h2 id="delete-tour-title" className="text-lg font-extrabold text-[var(--gn-palette-3)]">Eliminar salida</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--gn-palette-5)]">
              ¿Quieres eliminar <strong className="text-[var(--gn-palette-3)]">{title}</strong>? Esta acción no se puede deshacer.
            </p>
          </div>
        </div>
        {error ? <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold leading-5 text-red-700">{error}</p> : null}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onCancel} disabled={pending} className="h-10 rounded-lg border border-[#d9ded9] px-4 text-sm font-bold text-[var(--gn-palette-3)] transition-colors hover:bg-[var(--gn-palette-8)] disabled:opacity-50">Cancelar</button>
          <button type="button" onClick={onConfirm} disabled={pending} className="h-10 rounded-lg bg-red-600 px-4 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50">{pending ? "Eliminando…" : "Sí, eliminar"}</button>
        </div>
      </div>
    </div>
  );
}

function TourEditor({ tour, onDeleted }: { tour: TourRow | null; onDeleted?: () => void }) {
  const [form, setForm] = useState(tour ?? EMPTY);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePending, setDeletePending] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function save() {
    setMessage(null);
    startTransition(async () => {
      const result = await upsertTour({
        id: tour?.id,
        slug: form.slug || slugify(form.title),
        title: form.title,
        price: form.price,
        currencySymbol: form.currency_symbol,
        departureStart: form.departure_start,
        departureEnd: form.departure_end || null,
        imageUrl: form.image_url,
        imageW: form.image_w,
        imageH: form.image_h,
        hoverImageUrl: form.hover_image_url,
        hoverImageW: form.hover_image_w,
        hoverImageH: form.hover_image_h,
        buttonLabel: form.button_label,
        isPublished: form.is_published,
        details: form.details,
      });
      if (result.error) setMessage(result.error);
      else if (!tour) window.location.reload();
      else setMessage("Cambios publicados.");
    });
  }

  async function remove() {
    if (!tour || deletePending) return;
    setDeleteError(null);
    setDeletePending(true);
    try {
      const response = await fetch(`/api/admin/tours/${encodeURIComponent(tour.id)}`, {
        method: "DELETE",
        credentials: "same-origin",
        headers: { Accept: "application/json" },
      });
      const result = await response.json().catch(() => null) as { success?: boolean; error?: string } | null;
      if (!response.ok || !result?.success) {
        throw new Error(result?.error ?? "No se pudo eliminar la salida.");
      }
      onDeleted?.();
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "No se pudo eliminar la salida.");
    } finally {
      setDeletePending(false);
    }
  }

  function updateFact(index: number, patch: Partial<TourDetailCopy["facts"][number]>) {
    setForm((current) => ({
      ...current,
      details: {
        ...current.details,
        facts: current.details.facts.map((fact, factIndex) => factIndex === index ? { ...fact, ...patch } : fact),
      },
    }));
  }

  return (
    <article className="admin-card grid gap-5 p-5 lg:grid-cols-[250px_minmax(0,1fr)]">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
        <ImageUploader bucket="media" label="Imagen principal" value={form.image_w ? { url: form.image_url, width: form.image_w, height: form.image_h } : null} onChange={(image) => setForm((current) => ({ ...current, image_url: image.url, image_w: image.width, image_h: image.height }))} previewClassName="aspect-[4/5] w-full rounded-xl object-cover" />
        <ImageUploader bucket="media" label="Imagen secundaria (opcional)" value={form.hover_image_w && form.hover_image_url ? { url: form.hover_image_url, width: form.hover_image_w, height: form.hover_image_h! } : null} onChange={(image) => setForm((current) => ({ ...current, hover_image_url: image.url, hover_image_w: image.width, hover_image_h: image.height }))} previewClassName="aspect-[4/3] w-full rounded-xl object-cover lg:aspect-[16/7]" />
      </div>

      <div className="grid min-w-0 content-start gap-4 sm:grid-cols-2">
        <Field label="Nombre de la aventura" className="sm:col-span-2"><input className={inputCls} value={form.title} onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))} /></Field>
        <Field label="Identificador"><input className={inputCls} value={form.slug} placeholder={slugify(form.title) || "volcan-santa-ana"} onChange={(e) => setForm((current) => ({ ...current, slug: e.target.value }))} /></Field>
        <div className="grid grid-cols-[72px_1fr] gap-2">
          <Field label="Moneda"><input className={inputCls} value={form.currency_symbol} onChange={(e) => setForm((current) => ({ ...current, currency_symbol: e.target.value }))} placeholder="$" /></Field>
          <Field label="Precio"><input className={inputCls} value={form.price} onChange={(e) => setForm((current) => ({ ...current, price: e.target.value }))} /></Field>
        </div>
        <Field label="Fecha de salida"><input type="date" className={inputCls} value={form.departure_start} onChange={(e) => setForm((current) => ({ ...current, departure_start: e.target.value }))} /></Field>
        <Field label="Fecha final (opcional)"><input type="date" className={inputCls} value={form.departure_end ?? ""} onChange={(e) => setForm((current) => ({ ...current, departure_end: e.target.value || null }))} /></Field>
        <Field label="Texto del botón"><input className={inputCls} value={form.button_label} onChange={(e) => setForm((current) => ({ ...current, button_label: e.target.value }))} /></Field>
        <div className="flex items-end"><label className="flex h-10 items-center gap-2 text-xs font-semibold text-[var(--gn-palette-3)]"><input type="checkbox" checked={form.is_published} onChange={(e) => setForm((current) => ({ ...current, is_published: e.target.checked }))} />Publicado</label></div>

        <details className="rounded-xl border border-[#e2e6e2] bg-[#fafbfa] sm:col-span-2" open={!tour}>
          <summary className="cursor-pointer px-4 py-3 text-sm font-extrabold text-[var(--gn-palette-3)]">Información completa e íconos de la salida</summary>
          <div className="grid gap-4 border-t border-[#e2e6e2] p-4">
            <Field label="Introducción">
              <textarea className="admin-input min-h-24 px-3 py-2" value={form.details.lead} onChange={(e) => setForm((current) => ({ ...current, details: { ...current.details, lead: e.target.value } }))} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              {form.details.paragraphs.map((paragraph, index) => (
                <Field key={index} label={`Descripción ${index + 1}`}>
                  <textarea className="admin-input min-h-28 px-3 py-2" value={paragraph} onChange={(e) => setForm((current) => ({ ...current, details: { ...current.details, paragraphs: current.details.paragraphs.map((item, paragraphIndex) => paragraphIndex === index ? e.target.value : item) } }))} />
                </Field>
              ))}
            </div>
            <div>
              <p className="mb-3 text-xs font-bold text-[var(--gn-palette-3)]">Tarjetas informativas</p>
              <div className="grid gap-3 xl:grid-cols-2">
                {form.details.facts.map((fact, index) => {
                  const Icon = ICONS[fact.icon] ?? Activity;
                  return (
                    <div key={fact.key} className="grid grid-cols-[42px_minmax(105px,.7fr)_minmax(0,1.3fr)] items-center gap-2 rounded-lg border border-[#e2e6e2] bg-white p-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--gn-palette-8)] text-[var(--gn-palette-1)]"><Icon className="h-5 w-5" /></div>
                      <div className="grid gap-1">
                        <input aria-label={`Nombre de tarjeta ${index + 1}`} className="admin-input h-9 px-2 text-xs font-bold" value={fact.label} onChange={(e) => updateFact(index, { label: e.target.value })} />
                        <select aria-label={`Ícono de ${fact.label}`} className="admin-input h-9 px-2 text-xs" value={fact.icon} onChange={(e) => updateFact(index, { icon: e.target.value as TourIconId })}>
                          {TOUR_ICON_OPTIONS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
                        </select>
                      </div>
                      <input aria-label={`Valor de ${fact.label}`} className="admin-input h-9 px-2 text-xs" value={fact.value} onChange={(e) => updateFact(index, { value: e.target.value })} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </details>

        <div className="flex flex-wrap items-center justify-end gap-2 sm:col-span-2">
          <button type="button" onClick={save} disabled={pending} className="gn-button disabled:opacity-50">{pending ? "Guardando…" : tour ? "Guardar" : "Agregar salida"}</button>
          {tour ? <button type="button" onClick={() => { setDeleteError(null); setDeleteOpen(true); }} disabled={pending || deletePending} aria-label={`Eliminar ${tour.title}`} className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"><Trash2 className="h-4 w-4" /></button> : null}
        </div>
        {message ? <p className={`text-xs font-semibold sm:col-span-2 ${message.includes("publicados") ? "text-emerald-700" : "text-red-600"}`}>{message}</p> : null}
      </div>
      {tour && deleteOpen ? (
        <DeleteTourDialog
          title={tour.title}
          pending={deletePending}
          error={deleteError}
          onCancel={() => { if (!deletePending) setDeleteOpen(false); }}
          onConfirm={remove}
        />
      ) : null}
    </article>
  );
}

export function ToursManager({ tours: initial }: { tours: TourRow[] }) {
  const [tours, setTours] = useState(initial);
  const [, startTransition] = useTransition();

  function move(index: number, delta: number) {
    const next = [...tours];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setTours(next);
    startTransition(() => { void reorderTours(next.map((tour) => tour.id)); });
  }

  return (
    <div className="flex flex-col gap-5">
      {tours.map((tour, index) => (
        <div key={tour.id} className="relative">
          <div className="absolute right-3 top-3 z-10 flex gap-1">
            <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Subir" className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 shadow disabled:opacity-30"><ChevronUp className="h-4 w-4" /></button>
            <button type="button" onClick={() => move(index, 1)} disabled={index === tours.length - 1} aria-label="Bajar" className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 shadow disabled:opacity-30"><ChevronDown className="h-4 w-4" /></button>
          </div>
          <TourEditor tour={tour} onDeleted={() => setTours((current) => current.filter((item) => item.id !== tour.id))} />
        </div>
      ))}
      <div className="mt-3">
        <h2 className="mb-3 text-base font-extrabold text-[var(--gn-palette-3)]">Nueva salida</h2>
        <TourEditor tour={null} />
      </div>
    </div>
  );
}
