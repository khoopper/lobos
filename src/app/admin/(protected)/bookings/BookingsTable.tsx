"use client";

import { useState, useTransition } from "react";
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
    <tr className="border-b border-gray-100 last:border-0">
      <td className="px-4 py-3 font-medium text-[var(--gn-palette-3)]">{booking.customer_name}</td>
      <td className="px-4 py-3 text-[var(--gn-palette-5)]">
        {booking.email}
        <br />
        {booking.phone}
      </td>
      <td className="px-4 py-3 text-[var(--gn-palette-5)]">{booking.tourTitle}</td>
      <td className="px-4 py-3 text-[var(--gn-palette-5)]">{booking.requested_date}</td>
      <td className="px-4 py-3 text-[var(--gn-palette-5)]">{booking.num_people}</td>
      <td className="px-4 py-3">
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_COLOR[booking.status]}`}>
          {STATUS_LABEL[booking.status]}
        </span>
      </td>
      {canEdit ? (
        <td className="flex gap-2 px-4 py-3">
          {booking.status !== "confirmed" ? (
            <button
              type="button"
              disabled={pending}
              onClick={() => setStatus("confirmed")}
              className="rounded border border-green-600 px-2 py-1 text-xs text-green-700 disabled:opacity-50"
            >
              Confirmar
            </button>
          ) : null}
          {booking.status !== "cancelled" ? (
            <button
              type="button"
              disabled={pending}
              onClick={() => setStatus("cancelled")}
              className="rounded border border-red-400 px-2 py-1 text-xs text-red-600 disabled:opacity-50"
            >
              Cancelar
            </button>
          ) : null}
          <button
            type="button"
            disabled={pending}
            onClick={remove}
            className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-500 disabled:opacity-50"
          >
            Eliminar
          </button>
        </td>
      ) : null}
    </tr>
  );
}

export function BookingsTable({ bookings: initial, role }: { bookings: BookingRow[]; role: ProfileRole }) {
  const [bookings, setBookings] = useState(initial);
  const canEdit = role === "admin";

  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-200 text-[var(--gn-palette-5)]">
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
          {bookings.length ? (
            bookings.map((b) => (
              <Row
                key={b.id}
                booking={b}
                canEdit={canEdit}
                onChanged={(next) =>
                  setBookings((prev) => (next ? prev.map((x) => (x.id === b.id ? next : x)) : prev.filter((x) => x.id !== b.id)))
                }
              />
            ))
          ) : (
            <tr>
              <td colSpan={canEdit ? 7 : 6} className="px-4 py-8 text-center text-[var(--gn-palette-5)]">
                Aún no hay reservas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
