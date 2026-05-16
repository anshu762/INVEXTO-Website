import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import type { StockDetail, KeyStats } from "@/src/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;

    const stock = await prisma.stock.findUnique({
      where: { symbol },
      include: {
        stockPrices: {
          orderBy: { timestamp: "desc" },
          take: 2,
        },
      },
    });

    if (!stock) {
      return NextResponse.json(
        { success: false, error: "Stock not found" },
        { status: 404 }
      );
    }

    const [latest, previous] = stock.stockPrices;
    const currentPrice = latest ? Number(latest.price) : 0;
    const previousClose = previous ? Number(previous.price) : currentPrice;
    const changePercent =
      previousClose > 0
        ? ((currentPrice - previousClose) / previousClose) * 100
        : 0;
    const sharesOutstanding = Number(stock.sharesOutstanding);
    const marketCap = currentPrice * sharesOutstanding;

    const raw = stock.keyStats as Record<string, number>;
    const ttmEps = raw?.ttmEps || 0;

    const keyStats: KeyStats = {
      ttmEps,
      ttmPe: ttmEps > 0 ? currentPrice / ttmEps : 0,
      pbRatio: raw?.pbRatio || 0,
      sectorPe: raw?.sectorPe || 0,
      bookValue: raw?.bookValue || 0,
      dividendYield: raw?.dividendYield || 0,
      beta: raw?.beta || 0,
      avgVolume20d: raw?.avgVolume20d || 0,
      avgDeliveryPct20d: raw?.avgDeliveryPct20d || 0,
      upperCircuit: Number((currentPrice * 1.2).toFixed(2)),
      lowerCircuit: Number((currentPrice * 0.8).toFixed(2)),
    };

    const data: StockDetail = {
      id: stock.id,
      symbol: stock.symbol,
      name: stock.name,
      sector: stock.sector,
      faceValue: Number(stock.faceValue),
      isActive: stock.isActive,
      sharesOutstanding,
      currentPrice,
      previousClose,
      changePercent,
      marketCap,
      volume: latest ? Number(latest.volume) : 0,
      lastUpdated: latest ? latest.timestamp.toISOString() : new Date().toISOString(),
      keyStats,
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Stock detail API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stock detail" },
      { status: 500 }
    );
  }
}
