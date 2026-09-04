import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth/dal";
import { createServiceRoleClient } from "@/lib/supabase/server";

const TourId = z.string().uuid();

function revalidateTours() {
  revalidatePath("/");
  revalidatePath("/calendario");
  revalidatePath("/proximas-salidas");
  revalidatePath("/salidas/[slug]", "page");
  revalidatePath("/admin/tours");
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireRole(["admin"]);
  } catch {
    return NextResponse.json(
      { error: "Tu sesión venció. Vuelve a iniciar sesión e inténtalo nuevamente." },
      { status: 401 },
    );
  }

  try {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (origin && host && new URL(origin).host !== host) {
      return NextResponse.json({ error: "Origen no permitido." }, { status: 403 });
    }

    const { id: rawId } = await params;
    const parsedId = TourId.safeParse(rawId);
    if (!parsedId.success) {
      return NextResponse.json({ error: "La salida no es válida." }, { status: 400 });
    }

    const id = parsedId.data;
    const supabase = createServiceRoleClient();
    const { count, error: bookingsError } = await supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("tour_id", id);

    if (bookingsError) {
      return NextResponse.json({ error: "No se pudo comprobar el historial de reservas." }, { status: 500 });
    }
    if ((count ?? 0) > 0) {
      return NextResponse.json(
        {
          error: `Esta salida tiene ${count} ${count === 1 ? "reserva vinculada" : "reservas vinculadas"}. Desmárcala como publicada para ocultarla sin perder ese historial.`,
          code: "TOUR_HAS_BOOKINGS",
        },
        { status: 409 },
      );
    }

    const { error: deleteError } = await supabase.from("tours").delete().eq("id", id);
    if (deleteError) {
      return NextResponse.json({ error: "No se pudo eliminar la salida." }, { status: 500 });
    }

    // Remove the companion JSONB detail while preserving the rest of the
    // existing content block. A stale detail would be harmless, so cleanup
    // failure must not turn a successful deletion into a broken page.
    const { data: block } = await supabase
      .from("content_blocks")
      .select("data")
      .eq("key", "guias")
      .single();
    if (block?.data && typeof block.data === "object" && !Array.isArray(block.data)) {
      const blockData = block.data as Record<string, unknown>;
      const tourDetails = blockData.tourDetails && typeof blockData.tourDetails === "object" && !Array.isArray(blockData.tourDetails)
        ? { ...blockData.tourDetails as Record<string, unknown> }
        : {};
      delete tourDetails[id];
      await supabase.from("content_blocks").update({ data: { ...blockData, tourDetails } }).eq("key", "guias");
    }

    revalidateTours();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Ocurrió un error al eliminar la salida. Inténtalo nuevamente." },
      { status: 500 },
    );
  }
}
