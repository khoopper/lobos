"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { assetUrlSchema } from "@/lib/validation";

const TourSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones."),
  title: z.string().min(1),
  price: z.string().min(1),
  currencySymbol: z.string().max(4),
  departureStart: z.string().min(1),
  departureEnd: z.string().nullable(),
  imageUrl: assetUrlSchema,
  imageW: z.number().int().positive(),
  imageH: z.number().int().positive(),
  hoverImageUrl: assetUrlSchema.nullable(),
  hoverImageW: z.number().int().positive().nullable(),
  hoverImageH: z.number().int().positive().nullable(),
  buttonLabel: z.string().min(1),
  isPublished: z.boolean(),
});

export interface ActionState {
  error?: string;
  success?: boolean;
}

export async function upsertTour(raw: z.infer<typeof TourSchema>): Promise<ActionState> {
  await requireRole(["admin"]);
  const parsed = TourSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  const d = parsed.data;

  const supabase = await createClient();
  const row = {
    slug: d.slug,
    title: d.title,
    price: d.price,
    currency_symbol: d.currencySymbol,
    departure_start: d.departureStart,
    departure_end: d.departureEnd,
    image_url: d.imageUrl,
    image_w: d.imageW,
    image_h: d.imageH,
    hover_image_url: d.hoverImageUrl,
    hover_image_w: d.hoverImageW,
    hover_image_h: d.hoverImageH,
    button_label: d.buttonLabel,
    is_published: d.isPublished,
  };

  const { error } = d.id
    ? await supabase.from("tours").update(row).eq("id", d.id)
    : await supabase.from("tours").insert({ ...row, sort_order: 9999 });

  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/tours");
  return { success: true };
}

export async function deleteTour(id: string): Promise<ActionState> {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const { error } = await supabase.from("tours").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/tours");
  return { success: true };
}

export async function reorderTours(orderedIds: string[]): Promise<ActionState> {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const results = await Promise.all(
    orderedIds.map((id, i) => supabase.from("tours").update({ sort_order: i }).eq("id", id)),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) return { error: failed.error.message };
  revalidatePath("/");
  revalidatePath("/admin/tours");
  return { success: true };
}
