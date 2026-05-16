import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import type { StockWithPrice } from "@/src/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sector = searchParams.get("sector");
    const sort = searchParams.get("sort") || "symbol";

    const stocksPromise = prisma.stock.findMany({
      where: sector && sector !== "All"
        ? { sector, isActive: true }
        : { isActive: true },
      include: {
        stockPrices: {
          orderBy: { timestamp: "desc" },
          take: 2,
        },
      },
    });

    const stocks = await stocksPromise;

    const data: StockWithPrice[] = stocks.map((stock) => {
      const [latest, previous] = stock.stockPrices;
      const currentPrice = latest ? Number(latest.price) : 0;
      const previousClose = previous ? Number(previous.price) : currentPrice;
      const changePercent =
        previousClose > 0
          ? ((currentPrice - previousClose) / previousClose) * 100
          : 0;
      const sharesOutstanding = Number(stock.sharesOutstanding);
      const marketCap = currentPrice * sharesOutstanding;
      const volume = latest ? Number(latest.volume) : 0;

      return {
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
        volume,
        lastUpdated: latest ? latest.timestamp.toISOString() : new Date().toISOString(),
      };
    });

    if (sort === "price") {
      data.sort((a, b) => b.currentPrice - a.currentPrice);
    } else if (sort === "change") {
      data.sort((a, b) => b.changePercent - a.changePercent);
    } else if (sort === "marketCap") {
      data.sort((a, b) => b.marketCap - a.marketCap);
    } else {
      data.sort((a, b) => a.symbol.localeCompare(b.symbol));
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Stocks API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stocks" },
      { status: 500 }
    );
  }
}
