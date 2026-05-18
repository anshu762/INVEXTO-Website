import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { fetchHistoricalMulti } from "@/src/lib/yahoo-finance";
import { nseStocks } from "@/src/data/nse-stocks";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = await prisma.simulationEvent.findUnique({
      where: { id },
      select: { startRealDate: true, endRealDate: true, durationDays: true },
    });
    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    const symbols = nseStocks.map((s) => s.symbol);
    const priceHistory = await fetchHistoricalMulti(
      symbols,
      event.startRealDate,
      event.endRealDate
    );

    return NextResponse.json({
      success: true,
      data: { priceHistory, durationDays: event.durationDays },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch price data" },
      { status: 500 }
    );
  }
}
