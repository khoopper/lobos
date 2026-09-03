"use client";

import { useState, useTransition } from "react";
import { deleteReview, upsertReview } from "./actions";

export interface ReviewRow {
  id: string;
  author: string;
  review_date: string;
  rating: number;
  body_text: string;
  is_published: boolean;
}

const inputCls = "h-10 rounded-lg border border-[#69727d] bg-white px-3 text-[15px] text-[#1f2124]";
const EMPTY: Omit<ReviewRow, "id"> = {
  author: "",
  review_date: new Date().toISOString().slice(0, 10),
  rating: 5,
  body_text: "",
  is_published: true,
};

function ReviewEditor({
  review,
  onSaved,
  onDeleted,
}: {
  review: ReviewRow | null;
  onSaved: () => void;
  onDeleted?: () => void;
}) {
  const [form, setForm] = useState(review ?? EMPTY);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function save() {
    setMessage(null);
    startTransition(async () => {
      const result = await upsertReview({
        id: review?.id,
        author: form.author,
        reviewDate: form.review_date,
        rating: form.rating,
        bodyText: form.body_text,
        isPublished: form.is_published,
      });
      if (result.error) setMessage(result.error);
      else {
        onSaved();
        if (!review) setForm(EMPTY);
      }
    });
  }

  function remove() {
    if (!review) return;
    startTransition(async () => {
      const result = await deleteReview(review.id);
      if (result.error) setMessage(result.error);
      else onDeleted?.();
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-white p-6 shadow">
      <div className="flex gap-3">
        <input
          className={inputCls + " flex-1"}
          placeholder="Nombre del cliente"
          value={form.author}
          onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
        />
        <input
          type="date"
          className={inputCls}
          value={form.review_date}
          onChange={(e) => setForm((f) => ({ ...f, review_date: e.target.value }))}
        />
        <select
          className={inputCls}
          value={form.rating}
          onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} ★
            </option>
          ))}
        </select>
      </div>
      <textarea
        className={inputCls + " h-20"}
        placeholder="Texto de la reseña"
        value={form.body_text}
        onChange={(e) => setForm((f) => ({ ...f, body_text: e.target.value }))}
      />
      <label className="flex items-center gap-2 text-sm text-[var(--gn-palette-3)]">
        <input
          type="checkbox"
          checked={form.is_published}
          onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))}
        />
        Publicada
      </label>
      {message ? <p className="text-sm text-red-600">{message}</p> : null}
      <div className="flex gap-2">
        <button type="button" onClick={save} disabled={pending} className="gn-button disabled:opacity-60">
          {pending ? "Guardando…" : review ? "Guardar cambios" : "Agregar reseña"}
        </button>
        {review ? (
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

export function ReviewsManager({ reviews: initial }: { reviews: ReviewRow[] }) {
  const [reviews, setReviews] = useState(initial);

  return (
    <div className="flex flex-col gap-6">
      {reviews.map((review) => (
        <ReviewEditor
          key={review.id}
          review={review}
          onSaved={() => {}}
          onDeleted={() => setReviews((r) => r.filter((x) => x.id !== review.id))}
        />
      ))}

      <div>
        <h2 className="mb-3 text-lg font-bold text-[var(--gn-palette-3)]">Agregar nueva reseña</h2>
        <ReviewEditor review={null} onSaved={() => window.location.reload()} />
      </div>
    </div>
  );
}
