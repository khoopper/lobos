"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { assetUrlSchema } from "@/lib/validation";

const ItemSchema = z.object({
  id: z.string().uuid().optional(),
  imageUrl: assetUrlSchema,
  imageW: z.number().int().positive(),
  imageH: z.number().int().positive(),
  title: z.string(),
  isPublished: z.boolean(),
});

export interface ActionState {
  error?: string;
  success?: boolean;
}

export async function upsertGalleryItem(raw: z.infer<typeof ItemSchema>): Promise<ActionState> {
  await requireRole(["admin"]);
  const parsed = ItemSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  const d = parsed.data;

  const supabase = await createClient();
  const row = { image_url: d.imageUrl, image_w: d.imageW, image_h: d.imageH, title: d.title, is_published: d.isPublished };

  const { error } = d.id
    ? await supabase.from("gallery_items").update(row).eq("id", d.id)
    : await supabase.from("gallery_items").insert({ ...row, sort_order: 9999 });

  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/gallery");
  return { success: true };
}

export async function deleteGalleryItem(id: string): Promise<ActionState> {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const { error } = await supabase.from("gallery_items").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/gallery");
  return { success: true };
}
