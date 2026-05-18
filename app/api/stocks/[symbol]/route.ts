import { NextResponse } from "next/server";
import { fetchStockDetail } from "@/src/lib/yahoo-finance";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;

    const detail = await fetchStockDetail(symbol);
    if (!detail) {
      return NextResponse.json(
        { success: false, error: "Stock not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: detail });
  } catch (error) {
    console.error("Stock detail API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stock detail" },
      { status: 500 }
    );
  }
}
