"use client";

import { useState } from "react";
import { CalendarDays, Minus, Plus } from "lucide-react";
import { BookingDialog } from "./BookingDialog";

interface TourBookingPanelProps {
  tourId: string;
  tourTitle: string;
  departureStart: string;
  duration: string;
  price: string;
}

export function TourBookingPanel({
  tourId,
  tourTitle,
  departureStart,
  duration,
  price,
}: TourBookingPanelProps) {
  const [requestedDate, setRequestedDate] = useState(departureStart);
  const [people, setPeople] = useState(1);
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <>
      <aside className="rounded-2xl border border-black/5 bg-white p-5 shadow-[0_18px_45px_rgba(18,39,31,0.12)] sm:p-6 lg:sticky lg:top-6">
        <dl className="mb-6 grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
          <dt className="font-bold text-[var(--gn-palette-1)]">Duración</dt>
          <dd className="text-[var(--gn-palette-5)]">{duration}</dd>
          <dt className="font-bold text-[var(--gn-palette-1)]">Precio</dt>
          <dd className="text-[var(--gn-palette-5)]">{price}</dd>
        </dl>

        <label className="flex flex-col gap-2 text-xs font-bold text-[var(--gn-palette-3)]">
          Fecha de la salida
          <span className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--gn-palette-1)]" />
            <input
              type="date"
              value={requestedDate}
              onChange={(event) => setRequestedDate(event.target.value)}
              className="h-12 w-full rounded-xl border border-[#d9ded9] bg-white pl-10 pr-3 text-sm font-normal text-[var(--gn-palette-3)]"
            />
          </span>
        </label>

        <fieldset className="mt-5">
          <legend className="text-xs font-bold text-[var(--gn-palette-3)]">Adultos</legend>
          <div className="mt-2 grid h-12 w-40 grid-cols-3 overflow-hidden rounded-xl border border-[#d9ded9]">
            <button
              type="button"
              onClick={() => setPeople((current) => Math.max(1, current - 1))}
              aria-label="Quitar una persona"
              className="flex items-center justify-center text-[var(--gn-palette-1)] transition-colors hover:bg-[var(--gn-palette-8)]"
            >
              <Minus className="h-4 w-4" />
            </button>
            <output className="flex items-center justify-center text-sm text-[var(--gn-palette-3)]">{people}</output>
            <button
              type="button"
              onClick={() => setPeople((current) => Math.min(50, current + 1))}
              aria-label="Agregar una persona"
              className="flex items-center justify-center text-[var(--gn-palette-1)] transition-colors hover:bg-[var(--gn-palette-8)]"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-[11px] text-[var(--gn-palette-5)]">Mínimo: 1 persona</p>
        </fieldset>

        <button
          type="button"
          disabled={!requestedDate}
          onClick={() => setBookingOpen(true)}
          className="mt-5 block h-11 w-full rounded-lg bg-[var(--gn-palette-1)] px-5 text-center text-sm font-semibold text-white transition-colors hover:bg-[var(--gn-palette-2)] disabled:cursor-not-allowed disabled:opacity-45"
        >
          Solicitar reserva
        </button>
        <p className="mt-3 text-center text-[11px] leading-4 text-[var(--gn-palette-5)]">
          La solicitud no genera ningún cobro. Confirmaremos disponibilidad contigo.
        </p>
      </aside>

      {bookingOpen ? (
        <BookingDialog
          onClose={() => setBookingOpen(false)}
          tourId={tourId}
          tourTitle={tourTitle}
          initialDate={requestedDate}
          initialPeople={people}
        />
      ) : null}
    </>
  );
}
