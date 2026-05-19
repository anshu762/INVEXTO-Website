import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function PATCH() {
  try {
    const tournament = await prisma.tournament.findFirst({
      where: { status: "active" },
    });

    if (!tournament) {
      return NextResponse.json(
        { success: false, error: "No active tournament" },
        { status: 404 }
      );
    }

    await prisma.tournament.update({
      where: { id: tournament.id },
      data: { status: "completed" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Close tournament error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
