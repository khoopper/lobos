"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";

const KeySchema = z.enum(["guias", "camping", "fotografias"]);

export interface ActionState {
  error?: string;
  success?: boolean;
}

/** Generic writer for the three fixed-content JSONB blocks — each form validates its own shape before calling this. */
export async function updateContentBlock(key: z.infer<typeof KeySchema>, data: Record<string, unknown>): Promise<ActionState> {
  await requireRole(["admin"]);
  const parsedKey = KeySchema.safeParse(key);
  if (!parsedKey.success) return { error: "Sección inválida." };

  const supabase = await createClient();
  const { error } = await supabase.from("content_blocks").update({ data }).eq("key", parsedKey.data);
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/club-de-lobos");
  revalidatePath("/salidas/[slug]", "page");
  revalidatePath("/admin/sections");
  return { success: true };
}
