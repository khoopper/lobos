"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";

const HEX = /^#[0-9a-fA-F]{6}$/;

const SettingsSchema = z.object({
  logoHeaderUrl: z.string().url().nullable(),
  logoFooterUrl: z.string().url().nullable(),
  faviconUrl: z.string().url().nullable(),
  phoneLabel: z.string().min(1),
  phoneHref: z.string().min(1),
  email: z.string().email(),
  address: z.string().nullable(),
  socialFacebookUrl: z.string().url().or(z.literal("")).nullable(),
  socialInstagramUrl: z.string().url().or(z.literal("")).nullable(),
  socialYoutubeUrl: z.string().url().or(z.literal("")).nullable(),
  palette1: z.string().regex(HEX),
  palette2: z.string().regex(HEX),
  palette3: z.string().regex(HEX),
  palette5: z.string().regex(HEX),
  palette7: z.string().regex(HEX),
  palette8: z.string().regex(HEX),
  footerRegistro: z.string().nullable(),
  footerCopyright: z.string().min(1),
  footerCreditLabel: z.string().min(1),
  footerCreditHref: z.string().url().or(z.literal("")).nullable(),
});

export interface SettingsState {
  error?: string;
  success?: boolean;
}

export async function updateSiteSettings(raw: z.infer<typeof SettingsSchema>): Promise<SettingsState> {
  await requireRole(["admin"]);

  const parsed = SettingsSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }
  const d = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update({
      logo_header_url: d.logoHeaderUrl,
      logo_footer_url: d.logoFooterUrl,
      favicon_url: d.faviconUrl,
      phone_label: d.phoneLabel,
      phone_href: d.phoneHref,
      email: d.email,
      address: d.address,
      social_facebook_url: d.socialFacebookUrl || null,
      social_instagram_url: d.socialInstagramUrl || null,
      social_youtube_url: d.socialYoutubeUrl || null,
      palette_1: d.palette1,
      palette_2: d.palette2,
      palette_3: d.palette3,
      palette_5: d.palette5,
      palette_7: d.palette7,
      palette_8: d.palette8,
      footer_registro: d.footerRegistro,
      footer_copyright: d.footerCopyright,
      footer_credit_label: d.footerCreditLabel,
      footer_credit_href: d.footerCreditHref || null,
    })
    .eq("id", 1);

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { success: true };
}
