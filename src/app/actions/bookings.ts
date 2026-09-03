"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const BookingSchema = z.object({
  tourId: z.string().uuid(),
  customerName: z.string().min(2, { message: "Escribe tu nombre completo." }).max(200),
  email: z.string().email({ message: "Correo inválido." }),
  phone: z.string().min(7, { message: "Teléfono inválido." }).max(30),
  requestedDate: z.string().min(1, { message: "Elige una fecha." }),
  numPeople: z.number().int().min(1).max(50),
  notes: z.string().max(1000).optional(),
  /** Honeypot — real visitors never see or fill this field. */
  website: z.string().max(0, { message: "" }).optional(),
});

export interface BookingState {
  error?: string;
  success?: boolean;
}

/**
 * Public Server Action — the only path a visitor has to write to `bookings`.
 * One choke point for: validation, a honeypot check, and per-email
 * throttling. RLS additionally enforces `status = 'pending'` at the DB level
 * regardless of what this function sends, so a compromised client still
 * can't create a pre-confirmed booking.
 */
export async function createBooking(raw: unknown): Promise<BookingState> {
  const parsed = BookingSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }
  const d = parsed.data;

  // Honeypot tripped — pretend success so the bot doesn't learn anything, but insert nothing.
  if (d.website) return { success: true };

  const supabase = await createClient();

  // Basic throttle: refuse a second request from the same email within 2 minutes.
  const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("email", d.email)
    .gte("created_at", twoMinutesAgo);
  if (count && count > 0) {
    return { error: "Ya recibimos tu solicitud. Te contactaremos pronto — intenta de nuevo en unos minutos." };
  }

  const { error } = await supabase.from("bookings").insert({
    tour_id: d.tourId,
    customer_name: d.customerName,
    email: d.email,
    phone: d.phone,
    requested_date: d.requestedDate,
    num_people: d.numPeople,
    notes: d.notes || null,
    // Explicit, not left to the column DEFAULT: the anon INSERT policy's
    // `WITH CHECK (status = 'pending')` only matches against the value
    // actually sent in the PostgREST payload, not the column's default.
    status: "pending" as const,
  });

  if (error) {
    console.error("createBooking insert failed:", error.message);
    return { error: "No se pudo enviar la reserva. Intenta de nuevo." };
  }
  return { success: true };
}
