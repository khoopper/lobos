"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";

const ReviewSchema = z.object({
  id: z.string().uuid().optional(),
  author: z.string().min(1),
  reviewDate: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  bodyText: z.string().min(1),
  isPublished: z.boolean(),
});

export interface ActionState {
  error?: string;
  success?: boolean;
}

export async function upsertReview(raw: z.infer<typeof ReviewSchema>): Promise<ActionState> {
  await requireRole(["admin"]);
  const parsed = ReviewSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  const d = parsed.data;

  const supabase = await createClient();
  const row = { author: d.author, review_date: d.reviewDate, rating: d.rating, body_text: d.bodyText, is_published: d.isPublished };

  const { error } = d.id
    ? await supabase.from("reviews").update(row).eq("id", d.id)
    : await supabase.from("reviews").insert({ ...row, sort_order: 9999 });

  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/reviews");
  return { success: true };
}

export async function deleteReview(id: string): Promise<ActionState> {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/reviews");
  return { success: true };
}
