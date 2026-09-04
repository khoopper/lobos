"use client";

import { useEffect, useState } from "react";
import { createBooking } from "@/app/actions/bookings";

const inputCls = "h-10 rounded-lg border border-[#69727d] bg-white px-3 text-[15px] text-[#1f2124]";

export interface BookingDialogProps {
  onClose: () => void;
  tourId: string;
  tourTitle: string;
  initialDate?: string;
  initialPeople?: number;
}

/**
 * Public booking form, opened from a tour card's button (see ProductCard.tsx).
 * The parent only mounts this component while the dialog is open (rather
 * than always mounting it and toggling a prop), so pending/error/done state
 * resets for free on every open instead of needing a setState-in-effect.
 * Submits through the createBooking Server Action — see
 * src/app/actions/bookings.ts for the honeypot + throttle + RLS story.
 */
export function BookingDialog({
  onClose,
  tourId,
  tourTitle,
  initialDate = "",
  initialPeople = 1,
}: BookingDialogProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const result = await createBooking({
      tourId,
      customerName: String(form.get("customerName") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      requestedDate: String(form.get("requestedDate") ?? ""),
      numPeople: Number(form.get("numPeople") ?? 1),
      notes: String(form.get("notes") ?? ""),
      website: String(form.get("website") ?? ""),
    });
    setPending(false);
    if (result.error) setError(result.error);
    else setDone(true);
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-black/50"
      />
      <div className="relative flex w-full max-w-md flex-col gap-4 rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold text-[var(--gn-palette-3)]">Reservar: {tourTitle}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="text-xl leading-none text-[var(--gn-palette-5)]"
          >
            ×
          </button>
        </div>

        {done ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-green-700">
              ¡Listo! Recibimos tu solicitud para <strong>{tourTitle}</strong>. Te contactaremos pronto para
              confirmar.
            </p>
            <button type="button" onClick={onClose} className="gn-button w-fit">
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* Honeypot — hidden from real visitors via CSS, not `type="hidden"`,
                since some bots skip hidden inputs but still fill visible-looking ones. */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
              aria-hidden="true"
            />
            <label className="flex flex-col gap-1 text-sm text-[var(--gn-palette-3)]">
              Nombre completo
              <input name="customerName" required className={inputCls} />
            </label>
            <label className="flex flex-col gap-1 text-sm text-[var(--gn-palette-3)]">
              Correo
              <input name="email" type="email" required className={inputCls} />
            </label>
            <label className="flex flex-col gap-1 text-sm text-[var(--gn-palette-3)]">
              Teléfono
              <input name="phone" type="tel" required className={inputCls} />
            </label>
            <div className="flex gap-3">
              <label className="flex flex-1 flex-col gap-1 text-sm text-[var(--gn-palette-3)]">
                Fecha deseada
                <input name="requestedDate" type="date" defaultValue={initialDate} required className={inputCls} />
              </label>
              <label className="flex w-28 flex-col gap-1 text-sm text-[var(--gn-palette-3)]">
                Personas
                <input name="numPeople" type="number" min={1} max={50} defaultValue={initialPeople} required className={inputCls} />
              </label>
            </div>
            <label className="flex flex-col gap-1 text-sm text-[var(--gn-palette-3)]">
              Notas (opcional)
              <textarea name="notes" className={inputCls + " h-20"} />
            </label>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button type="submit" disabled={pending} className="gn-button disabled:cursor-not-allowed disabled:opacity-60">
              {pending ? "Enviando…" : "Enviar solicitud"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
