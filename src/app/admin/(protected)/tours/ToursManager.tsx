"use client";

import { useState, useTransition } from "react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { deleteTour, reorderTours, upsertTour } from "./actions";

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
}

const inputCls = "h-10 rounded-lg border border-[#69727d] bg-white px-3 text-[15px] text-[#1f2124]";
const EMPTY: Omit<TourRow, "id"> = {
  slug: "",
  title: "",
  price: "",
  currency_symbol: "$",
  departure_start: "",
  departure_end: null,
  image_url: "",
  image_w: 0,
  image_h: 0,
  hover_image_url: null,
  hover_image_w: null,
  hover_image_h: null,
  button_label: "Ver salida",
  is_published: true,
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function TourEditor({
  tour,
  onSaved,
  onDeleted,
}: {
  tour: TourRow | null;
  onSaved: () => void;
  onDeleted?: () => void;
}) {
  const [form, setForm] = useState(tour ?? EMPTY);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

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
      });
      if (result.error) setMessage(result.error);
      else {
        onSaved();
        if (!tour) setForm(EMPTY);
      }
    });
  }

  function remove() {
    if (!tour) return;
    startTransition(async () => {
      const result = await deleteTour(tour.id);
      if (result.error) setMessage(result.error);
      else onDeleted?.();
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-white p-6 shadow">
      <div className="flex flex-wrap gap-6">
        <ImageUploader
          bucket="media"
          label="Imagen principal"
          value={form.image_w ? { url: form.image_url, width: form.image_w, height: form.image_h } : null}
          onChange={(img) => setForm((f) => ({ ...f, image_url: img.url, image_w: img.width, image_h: img.height }))}
          previewClassName="h-24 w-32 rounded-lg object-cover"
        />
        <ImageUploader
          bucket="media"
          label="Imagen al pasar el mouse (opcional)"
          value={
            form.hover_image_w
              ? { url: form.hover_image_url!, width: form.hover_image_w, height: form.hover_image_h! }
              : null
          }
          onChange={(img) =>
            setForm((f) => ({ ...f, hover_image_url: img.url, hover_image_w: img.width, hover_image_h: img.height }))
          }
          previewClassName="h-24 w-32 rounded-lg object-cover"
        />
      </div>
      <input
        className={inputCls}
        placeholder="Título (ej. Farallones de Sutatausa)"
        value={form.title}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
      />
      <div className="flex gap-3">
        <input
          className={inputCls + " w-16"}
          placeholder="$"
          value={form.currency_symbol}
          onChange={(e) => setForm((f) => ({ ...f, currency_symbol: e.target.value }))}
        />
        <input
          className={inputCls + " flex-1"}
          placeholder="Precio, ej. 169.000"
          value={form.price}
          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
        />
      </div>
      <div className="flex gap-3">
        <label className="flex-1 text-sm text-[var(--gn-palette-5)]">
          Fecha de salida
          <input
            type="date"
            className={inputCls + " mt-1 w-full"}
            value={form.departure_start}
            onChange={(e) => setForm((f) => ({ ...f, departure_start: e.target.value }))}
          />
        </label>
        <label className="flex-1 text-sm text-[var(--gn-palette-5)]">
          Fecha final (si dura más de un día)
          <input
            type="date"
            className={inputCls + " mt-1 w-full"}
            value={form.departure_end ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, departure_end: e.target.value || null }))}
          />
        </label>
      </div>
      <input
        className={inputCls}
        placeholder="Texto del botón"
        value={form.button_label}
        onChange={(e) => setForm((f) => ({ ...f, button_label: e.target.value }))}
      />
      <label className="flex items-center gap-2 text-sm text-[var(--gn-palette-3)]">
        <input
          type="checkbox"
          checked={form.is_published}
          onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))}
        />
        Publicado (visible en el sitio)
      </label>
      {message ? <p className="text-sm text-red-600">{message}</p> : null}
      <div className="flex gap-2">
        <button type="button" onClick={save} disabled={pending} className="gn-button disabled:opacity-60">
          {pending ? "Guardando…" : tour ? "Guardar cambios" : "Agregar salida"}
        </button>
        {tour ? (
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

export function ToursManager({ tours: initial }: { tours: TourRow[] }) {
  const [tours, setTours] = useState(initial);
  const [, startTransition] = useTransition();

  function move(index: number, delta: number) {
    const next = [...tours];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setTours(next);
    startTransition(() => {
      void reorderTours(next.map((t) => t.id));
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {tours.map((tour, i) => (
        <div key={tour.id} className="flex items-start gap-2">
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
              disabled={i === tours.length - 1}
              className="h-8 w-8 rounded border border-[#69727d] text-sm disabled:opacity-30"
              aria-label="Bajar"
            >
              ↓
            </button>
          </div>
          <div className="flex-1">
            <TourEditor
              tour={tour}
              onSaved={() => {}}
              onDeleted={() => setTours((t) => t.filter((x) => x.id !== tour.id))}
            />
          </div>
        </div>
      ))}

      <div>
        <h2 className="mb-3 text-lg font-bold text-[var(--gn-palette-3)]">Agregar nueva salida</h2>
        <TourEditor tour={null} onSaved={() => window.location.reload()} />
      </div>
    </div>
  );
}
