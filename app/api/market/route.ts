import { NextResponse } from "next/server";
import { getSectors } from "@/src/data/nse-stocks";
import { fetchMarketMovers } from "@/src/lib/yahoo-finance";

export async function GET() {
  try {
    const movers = await fetchMarketMovers();
    const sectors = getSectors();

    return NextResponse.json({
      success: true,
      data: {
        ...movers,
        sectors,
      },
    });
  } catch (error) {
    console.error("Market API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch market data" },
      { status: 500 }
    );
  }
}
