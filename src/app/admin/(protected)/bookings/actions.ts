"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import type { BookingStatus } from "@/lib/supabase/types";

export interface ActionState {
  error?: string;
  success?: boolean;
}

/** Admin-only — worker's RLS grant is SELECT-only on bookings, matching "únicamente podrá ver". */
export async function updateBookingStatus(id: string, status: BookingStatus): Promise<ActionState> {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/bookings");
  return { success: true };
}

export async function deleteBooking(id: string): Promise<ActionState> {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const { error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/bookings");
  return { success: true };
}
