"use client";

import { useState, useTransition } from "react";
import { CalendarX2 } from "lucide-react";
import { deleteBooking, updateBookingStatus } from "./actions";
import type { BookingStatus, ProfileRole } from "@/lib/supabase/types";

export interface BookingRow {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  requested_date: string;
  num_people: number;
  status: BookingStatus;
  created_at: string;
  tourTitle: string;
}

const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
};

const STATUS_COLOR: Record<BookingStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function Row({ booking, canEdit, onChanged }: { booking: BookingRow; canEdit: boolean; onChanged: (next: BookingRow | null) => void }) {
  const [pending, startTransition] = useTransition();

  function setStatus(status: BookingStatus) {
    startTransition(async () => {
      const result = await updateBookingStatus(booking.id, status);
      if (!result.error) onChanged({ ...booking, status });
    });
  }

  function remove() {
    startTransition(async () => {
      const result = await deleteBooking(booking.id);
      if (!result.error) onChanged(null);
    });
  }

  return (
    <tr className="border-b border-black/5 transition-colors last:border-0 hover:bg-[var(--gn-palette-8)]">
      <td className="px-4 py-3 font-semibold text-[var(--gn-palette-3)]">{booking.customer_name}</td>
      <td className="px-4 py-3 text-[var(--gn-palette-5)]">
        {booking.email}
        <br />
        {booking.phone}
      </td>
      <td className="px-4 py-3 text-[var(--gn-palette-5)]">{booking.tourTitle}</td>
      <td className="px-4 py-3 text-[var(--gn-palette-5)]">{booking.requested_date}</td>
      <td className="px-4 py-3 text-[var(--gn-palette-5)]">{booking.num_people}</td>
      <td className="px-4 py-3">
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_COLOR[booking.status]}`}>
          {STATUS_LABEL[booking.status]}
        </span>
      </td>
      {canEdit ? (
        <td className="px-4 py-3">
          <div className="flex flex-wrap gap-1.5">
            {booking.status !== "confirmed" ? (
              <button
                type="button"
                disabled={pending}
                onClick={() => setStatus("confirmed")}
                className="rounded-lg border border-emerald-200 px-2 py-1 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 disabled:opacity-50"
              >
                Confirmar
              </button>
            ) : null}
            {booking.status !== "cancelled" ? (
              <button
                type="button"
                disabled={pending}
                onClick={() => setStatus("cancelled")}
                className="rounded-lg border border-red-200 px-2 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                Cancelar
              </button>
            ) : null}
            <button
              type="button"
              disabled={pending}
              onClick={remove}
              className="rounded-lg border border-[#d9ded9] px-2 py-1 text-xs font-semibold text-[var(--gn-palette-5)] transition-colors hover:bg-[var(--gn-palette-8)] disabled:opacity-50"
            >
              Eliminar
            </button>
          </div>
        </td>
      ) : null}
    </tr>
  );
}

export function BookingsTable({ bookings: initial, role }: { bookings: BookingRow[]; role: ProfileRole }) {
  const [bookings, setBookings] = useState(initial);
  const canEdit = role === "admin";

  if (bookings.length === 0) {
    return (
      <div className="admin-card flex flex-col items-center gap-3 px-6 py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--gn-palette-8)] text-[var(--gn-palette-1)]"><CalendarX2 className="h-6 w-6" /></span>
        <div>
          <p className="font-bold text-[var(--gn-palette-3)]">Aún no hay reservas</p>
          <p className="mt-1 max-w-sm text-sm leading-6 text-[var(--gn-palette-5)]">Cuando alguien reserve una salida desde el sitio público, aparecerá aquí para confirmarla o rechazarla.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-card overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-black/5 text-xs font-bold uppercase tracking-wide text-[var(--gn-palette-5)]">
          <tr>
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Contacto</th>
            <th className="px-4 py-3">Salida</th>
            <th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3">Personas</th>
            <th className="px-4 py-3">Estado</th>
            {canEdit ? <th className="px-4 py-3">Acciones</th> : null}
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <Row
              key={b.id}
              booking={b}
              canEdit={canEdit}
              onChanged={(next) =>
                setBookings((prev) => (next ? prev.map((x) => (x.id === b.id ? next : x)) : prev.filter((x) => x.id !== b.id)))
              }
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
