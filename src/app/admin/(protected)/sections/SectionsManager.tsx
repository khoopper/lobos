"use client";

import { useState, useTransition } from "react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { updateContentBlock } from "./actions";
import type { CampingBlock, FotografiasBlock, GuiasBlock } from "@/lib/queries/site-content";

const inputCls = "h-10 rounded-lg border border-[#69727d] bg-white px-3 text-[15px] text-[#1f2124]";

function SaveBar({ pending, message, onSave }: { pending: boolean; message: string | null; onSave: () => void }) {
  return (
    <div className="flex items-center gap-3">
      <button type="button" onClick={onSave} disabled={pending} className="gn-button disabled:opacity-60">
        {pending ? "Guardando…" : "Guardar cambios"}
      </button>
      {message ? <span className="text-sm text-green-700">{message}</span> : null}
    </div>
  );
}

function GuiasEditor({ initial }: { initial: GuiasBlock }) {
  const [form, setForm] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function save() {
    startTransition(async () => {
      const result = await updateContentBlock("guias", form as unknown as Record<string, unknown>);
      setMessage(result.error ?? "Guardado.");
    });
  }

  return (
    <section className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow">
      <h2 className="text-lg font-bold text-[var(--gn-palette-3)]">Guías expertos locales</h2>
      <input
        className={inputCls}
        placeholder="Título"
        value={form.heading}
        onChange={(e) => setForm((f) => ({ ...f, heading: e.target.value }))}
      />
      <input
        className={inputCls}
        placeholder="Texto del botón"
        value={form.buttonLabel}
        onChange={(e) => setForm((f) => ({ ...f, buttonLabel: e.target.value }))}
      />
      <input
        className={inputCls}
        placeholder="Enlace del botón"
        value={form.buttonHref}
        onChange={(e) => setForm((f) => ({ ...f, buttonHref: e.target.value }))}
      />
      <div className="flex gap-6">
        {[0, 1].map((i) => (
          <ImageUploader
            key={i}
            bucket="media"
            label={`Foto ${i + 1}`}
            value={form.images[i] ? { url: form.images[i].src, width: form.images[i].width, height: form.images[i].height } : null}
            onChange={(img) =>
              setForm((f) => {
                const images = [...f.images];
                images[i] = { src: img.url, width: img.width, height: img.height };
                return { ...f, images };
              })
            }
            previewClassName="h-24 w-32 rounded-lg object-cover"
          />
        ))}
      </div>
      <SaveBar pending={pending} message={message} onSave={save} />
    </section>
  );
}

function CampingEditor({ initial }: { initial: CampingBlock }) {
  const [form, setForm] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function save() {
    startTransition(async () => {
      const result = await updateContentBlock("camping", form as unknown as Record<string, unknown>);
      setMessage(result.error ?? "Guardado.");
    });
  }

  return (
    <section className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow">
      <h2 className="text-lg font-bold text-[var(--gn-palette-3)]">Camping</h2>
      <input
        className={inputCls}
        placeholder="Título"
        value={form.heading}
        onChange={(e) => setForm((f) => ({ ...f, heading: e.target.value }))}
      />
      <textarea
        className={inputCls + " h-24"}
        placeholder="Texto"
        value={form.body}
        onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
      />
      <input
        className={inputCls}
        placeholder="Texto del botón"
        value={form.buttonLabel}
        onChange={(e) => setForm((f) => ({ ...f, buttonLabel: e.target.value }))}
      />
      <input
        className={inputCls}
        placeholder="Enlace del botón"
        value={form.buttonHref}
        onChange={(e) => setForm((f) => ({ ...f, buttonHref: e.target.value }))}
      />
      <ImageUploader
        bucket="media"
        label="Foto"
        value={form.image ? { url: form.image.src, width: form.image.width, height: form.image.height } : null}
        onChange={(img) => setForm((f) => ({ ...f, image: { src: img.url, width: img.width, height: img.height } }))}
        previewClassName="h-32 w-48 rounded-lg object-cover"
      />
      <SaveBar pending={pending} message={message} onSave={save} />
    </section>
  );
}

function FotografiasEditor({ initial }: { initial: FotografiasBlock }) {
  const [form, setForm] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function save() {
    startTransition(async () => {
      const result = await updateContentBlock("fotografias", form as unknown as Record<string, unknown>);
      setMessage(result.error ?? "Guardado.");
    });
  }

  return (
    <section className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow">
      <h2 className="text-lg font-bold text-[var(--gn-palette-3)]">Fotografías de la semana</h2>
      <input
        className={inputCls}
        placeholder="Título"
        value={form.heading}
        onChange={(e) => setForm((f) => ({ ...f, heading: e.target.value }))}
      />
      <textarea
        className={inputCls + " h-24"}
        placeholder="Texto"
        value={form.body}
        onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
      />
      <p className="text-xs text-[var(--gn-palette-5)]">Las fotos de la galería se administran en &quot;Galería&quot;.</p>
      <SaveBar pending={pending} message={message} onSave={save} />
    </section>
  );
}

export function SectionsManager({
  guias,
  camping,
  fotografias,
}: {
  guias: GuiasBlock;
  camping: CampingBlock;
  fotografias: FotografiasBlock;
}) {
  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <GuiasEditor initial={guias} />
      <CampingEditor initial={camping} />
      <FotografiasEditor initial={fotografias} />
    </div>
  );
}
