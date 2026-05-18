import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { requireSession } from "@/src/lib/session";
import { fetchHistoricalMulti } from "@/src/lib/yahoo-finance";
import { nseStocks } from "@/src/data/nse-stocks";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireSession(req);
    const { id } = await params;

    const event = await prisma.simulationEvent.findUnique({
      where: { id },
    });
    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    const stocks = nseStocks;
    const symbols = stocks.map((s) => s.symbol);

    const priceHistory = await fetchHistoricalMulti(
      symbols,
      event.startRealDate,
      event.endRealDate
    );

    if (Object.keys(priceHistory).length === 0) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch historical data for this event" },
        { status: 502 }
      );
    }

    const type =
      event.name.toLowerCase().includes("crash") ||
      event.name.toLowerCase().includes("selloff") ||
      event.name.toLowerCase().includes("crisis") ||
      event.name.toLowerCase().includes("demonetisation")
        ? "crash"
        : "rally";

    return NextResponse.json({
      success: true,
      data: {
        event: {
          id: event.id,
          name: event.name,
          description: event.description,
          startRealDate: event.startRealDate.toISOString(),
          endRealDate: event.endRealDate.toISOString(),
          durationDays: event.durationDays,
          type,
        },
        stocks,
        priceHistory,
        startingCash: 100000,
      },
    });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Simulation start error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to start simulation" },
      { status: 500 }
    );
  }
}
