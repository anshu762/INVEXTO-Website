import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { requireSession } from "@/src/lib/session";

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireSession(request);
    if (!(user as any).isAdmin) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { tournamentId } = await request.json();

    if (!tournamentId) {
      return NextResponse.json(
        { success: false, error: "Tournament ID is required" },
        { status: 400 }
      );
    }

    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
    });

    if (!tournament || tournament.status !== "active") {
      return NextResponse.json(
        { success: false, error: "Tournament is not active or does not exist" },
        { status: 404 }
      );
    }

    await prisma.tournament.update({
      where: { id: tournament.id },
      data: { status: "completed" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("Close tournament error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
