"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CalendarTourData } from "@/lib/queries/site-content";

const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
] as const;
const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"] as const;

function dateParts(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month: month - 1, day };
}

function initialMonth(tours: CalendarTourData[]) {
  const today = new Date();
  const sorted = tours.map((tour) => dateParts(tour.departureDate)).sort((a, b) =>
    new Date(a.year, a.month, a.day).getTime() - new Date(b.year, b.month, b.day).getTime());
  const upcoming = sorted.find((date) => new Date(date.year, date.month + 1, 0) >= today);
  return upcoming ?? sorted[0] ?? { year: today.getFullYear(), month: today.getMonth(), day: 1 };
}

function formatDate(iso: string) {
  const { year, month, day } = dateParts(iso);
  return `${day} de ${MONTHS[month]} de ${year}`;
}

export function AdventureCalendar({ tours }: { tours: CalendarTourData[] }) {
  const initial = useMemo(() => initialMonth(tours), [tours]);
  const [visible, setVisible] = useState({ year: initial.year, month: initial.month });
  const firstWeekday = (new Date(visible.year, visible.month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(visible.year, visible.month + 1, 0).getDate();
  const previousMonthDays = new Date(visible.year, visible.month, 0).getDate();

  const cells = Array.from({ length: 42 }, (_, index) => {
    const rawDay = index - firstWeekday + 1;
    if (rawDay < 1) return { day: previousMonthDays + rawDay, current: false, offset: -1 };
    if (rawDay > daysInMonth) return { day: rawDay - daysInMonth, current: false, offset: 1 };
    return { day: rawDay, current: true, offset: 0 };
  });

  function moveMonth(delta: number) {
    setVisible((current) => {
      const date = new Date(current.year, current.month + delta, 1);
      return { year: date.getFullYear(), month: date.getMonth() };
    });
  }

  const monthTours = tours.filter((tour) => {
    const date = dateParts(tour.departureDate);
    return date.year === visible.year && date.month === visible.month;
  });

  return (
    <section aria-label={`Calendario de ${MONTHS[visible.month]} de ${visible.year}`}>
      <div className="flex items-center justify-between border border-black/10 bg-white px-4 py-4 sm:px-6">
        <button type="button" onClick={() => moveMonth(-1)} aria-label="Mes anterior" className="flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 text-[var(--gn-palette-1)] hover:bg-[var(--gn-palette-8)]">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-center text-lg font-extrabold capitalize text-[var(--gn-palette-3)] sm:text-xl">{MONTHS[visible.month]} {visible.year}</h2>
        <button type="button" onClick={() => moveMonth(1)} aria-label="Mes siguiente" className="flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 text-[var(--gn-palette-1)] hover:bg-[var(--gn-palette-8)]">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="hidden grid-cols-7 border-l border-black/10 sm:grid">
        {WEEKDAYS.map((weekday) => <div key={weekday} className="border-b border-r border-black/10 bg-[var(--gn-palette-8)] px-2 py-3 text-center text-xs font-extrabold text-[var(--gn-palette-3)]">{weekday}</div>)}
        {cells.map((cell, index) => {
          const events = cell.current ? monthTours.filter((tour) => dateParts(tour.departureDate).day === cell.day) : [];
          return (
            <div key={`${cell.offset}-${cell.day}-${index}`} className={`min-h-32 border-b border-r border-black/10 p-2 ${cell.current ? "bg-white" : "bg-black/[.025]"}`}>
              <span className={`text-xs font-bold ${cell.current ? "text-[var(--gn-palette-3)]" : "text-black/25"}`}>{cell.day}</span>
              <div className="mt-2 space-y-2">
                {events.map((tour) => (
                  <a key={tour.id} href={`/salidas/${encodeURIComponent(tour.slug)}`} className="block rounded-md bg-[var(--gn-palette-1)] p-2 text-[10px] font-bold leading-4 text-white transition-colors hover:bg-[var(--gn-palette-2)]">
                    {tour.title}
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-x border-b border-black/10 bg-white p-4 sm:hidden">
        {monthTours.length ? (
          <div className="space-y-3">
            {monthTours.map((tour) => (
              <a key={tour.id} href={`/salidas/${encodeURIComponent(tour.slug)}`} className="block rounded-xl border border-black/10 p-4">
                <span className="text-xs font-bold text-[var(--gn-palette-1)]">{formatDate(tour.departureDate)}</span>
                <strong className="mt-1 block text-sm text-[var(--gn-palette-3)]">{tour.title}</strong>
              </a>
            ))}
          </div>
        ) : <p className="py-5 text-center text-sm text-[var(--gn-palette-5)]">No hay salidas publicadas para este mes.</p>}
      </div>
    </section>
  );
}
