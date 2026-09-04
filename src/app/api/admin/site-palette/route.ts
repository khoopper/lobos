import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth/dal";
import { SITE_PALETTES } from "@/lib/site-palettes";
import { createClient } from "@/lib/supabase/server";

const PaletteRequest = z.object({
  id: z.enum(["lobos", "original", "volcan"]),
});

export async function POST(request: Request) {
  await requireRole(["admin"]);

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return NextResponse.json({ error: "Origen no permitido." }, { status: 403 });
  }

  const parsed = PaletteRequest.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Paleta no válida." }, { status: 400 });
  }

  const colors = SITE_PALETTES[parsed.data.id].colors;
  const supabase = await createClient();
  const { error } = await supabase.from("site_settings").update({
    palette_1: colors[1],
    palette_2: colors[2],
    palette_3: colors[3],
    palette_5: colors[5],
    palette_7: colors[7],
    palette_8: colors[8],
  }).eq("id", 1);

  if (error) {
    return NextResponse.json({ error: "No se pudo aplicar la paleta." }, { status: 500 });
  }

  revalidatePath("/");
  const response = NextResponse.json({ success: true });
  response.cookies.set("lobos-site-palette", parsed.data.id, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
