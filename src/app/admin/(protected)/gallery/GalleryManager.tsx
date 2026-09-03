"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { deleteGalleryItem, upsertGalleryItem } from "./actions";

export interface GalleryItemRow {
  id: string;
  image_url: string;
  image_w: number;
  image_h: number;
  title: string;
  is_published: boolean;
}

const inputCls = "h-9 w-full rounded-lg border border-[#69727d] bg-white px-2 text-[14px] text-[#1f2124]";

function ItemCard({ item, onChanged }: { item: GalleryItemRow; onChanged: (next: GalleryItemRow | null) => void }) {
  const [title, setTitle] = useState(item.title);
  const [published, setPublished] = useState(item.is_published);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function save(next: Partial<GalleryItemRow>) {
    const merged = { ...item, title, is_published: published, ...next };
    startTransition(async () => {
      const result = await upsertGalleryItem({
        id: merged.id,
        imageUrl: merged.image_url,
        imageW: merged.image_w,
        imageH: merged.image_h,
        title: merged.title,
        isPublished: merged.is_published,
      });
      if (result.error) setError(result.error);
      else onChanged(merged);
    });
  }

  function remove() {
    startTransition(async () => {
      const result = await deleteGalleryItem(item.id);
      if (result.error) setError(result.error);
      else onChanged(null);
    });
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-white p-3 shadow">
      <Image src={item.image_url} alt="" width={item.image_w} height={item.image_h} className="h-28 w-full rounded-lg object-cover" />
      <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" />
      <label className="flex items-center gap-2 text-xs text-[var(--gn-palette-3)]">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        Publicada
      </label>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => save({})}
          disabled={pending}
          className="flex-1 rounded-lg bg-[var(--gn-palette-1)] px-2 py-1.5 text-xs font-medium text-white disabled:opacity-60"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={remove}
          disabled={pending}
          className="rounded-lg border border-red-300 px-2 py-1.5 text-xs text-red-600 disabled:opacity-60"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

export function GalleryManager({ items: initial }: { items: GalleryItemRow[] }) {
  const [items, setItems] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function addNew(image: { url: string; width: number; height: number }) {
    setError(null);
    startTransition(async () => {
      const result = await upsertGalleryItem({
        imageUrl: image.url,
        imageW: image.width,
        imageH: image.height,
        title: "",
        isPublished: true,
      });
      if (result.error) setError(result.error);
      else window.location.reload();
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onChanged={(next) => setItems((prev) => (next ? prev.map((i) => (i.id === item.id ? next : i)) : prev.filter((i) => i.id !== item.id)))}
          />
        ))}
      </div>

      <div className="max-w-sm rounded-xl bg-white p-6 shadow">
        <h2 className="mb-3 text-lg font-bold text-[var(--gn-palette-3)]">Agregar foto</h2>
        <ImageUploader bucket="media" onChange={addNew} />
        {pending ? <p className="mt-2 text-sm text-[var(--gn-palette-5)]">Agregando…</p> : null}
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      </div>
    </div>
  );
}
