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

const inputCls = "admin-input h-9 px-2";

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
    <div className="admin-card flex flex-col gap-2 p-3">
      <Image src={item.image_url} alt="" width={item.image_w} height={item.image_h} className="aspect-[4/5] w-full rounded-xl object-cover" />
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--gn-palette-3)]">Galería</h1>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-[var(--gn-palette-5)]">Fotografías de rutas y experiencias visibles en la portada.</p>
        </div>
        <div className="admin-card w-full shrink-0 p-4 sm:w-72">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--gn-palette-3)]">Agregar foto</h2>
          <ImageUploader bucket="media" onChange={addNew} />
          {pending ? <p className="mt-2 text-xs text-[var(--gn-palette-5)]">Agregando…</p> : null}
          {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onChanged={(next) => setItems((prev) => (next ? prev.map((i) => (i.id === item.id ? next : i)) : prev.filter((i) => i.id !== item.id)))}
          />
        ))}
      </div>
    </div>
  );
}
