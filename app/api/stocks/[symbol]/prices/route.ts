import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import type { PricePoint } from "@/src/types";

function hashSymbol(symbol: string): number {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = (hash * 31 + symbol.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) | 0;
    return (s >>> 0) / 0xffffffff;
  };
}

function generateDayPrices(
  basePrice: number,
  dayCount: number,
  seed: number,
  volatility: number
): number[] {
  const rng = seededRandom(seed);
  const prices: number[] = [];
  let price = basePrice;
  for (let i = 0; i < dayCount; i++) {
    const change = (rng() - 0.5) * 2 * volatility;
    price = price * (1 + change);
    if (price < 1) price = 1;
    prices.push(Number(price.toFixed(2)));
  }
  return prices;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;
    const url = new URL(_request.url);
    const range = url.searchParams.get("range") || "1d";

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

    const latestPrice = stock.stockPrices[0]
      ? Number(stock.stockPrices[0].price)
      : 100;
    const seed = hashSymbol(symbol);
    const rng = seededRandom(seed + range.charCodeAt(0));
    const now = new Date();
    let data: PricePoint[];

    if (range === "1d") {
      const marketOpen = new Date(now);
      marketOpen.setHours(9, 15, 0, 0);
      const marketClose = new Date(now);
      marketClose.setHours(15, 30, 0, 0);

      if (now < marketOpen) {
        marketOpen.setDate(marketOpen.getDate() - 1);
        marketClose.setDate(marketClose.getDate() - 1);
      }

      const intervalMs = 15 * 60 * 1000;
      const totalIntervals = 25;
      const dailyRng = seededRandom(seed + 999);

      let p = latestPrice * (1 - 0.02 + dailyRng() * 0.04);
      data = [];
      for (let i = 0; i < totalIntervals; i++) {
        const ts = new Date(marketOpen.getTime() + i * intervalMs);
        const change = (dailyRng() - 0.5) * 0.02;
        p = p * (1 + change);
        if (p < 1) p = 1;
        data.push({
          timestamp: ts.toISOString(),
          price: Number(p.toFixed(2)),
          volume: Math.floor(100000 + dailyRng() * 500000),
        });
      }
    } else if (range === "1m") {
      const days = 30;
      const prices = generateDayPrices(latestPrice, days, seed + 100, 0.025);
      data = prices.map((price, i) => {
        const d = new Date(now);
        d.setDate(d.getDate() - (days - 1 - i));
        d.setHours(15, 30, 0, 0);
        return {
          timestamp: d.toISOString(),
          price,
          volume: Math.floor(500000 + rng() * 3000000),
        };
      });
    } else {
      const days = 365;
      const prices = generateDayPrices(latestPrice, days, seed + 200, 0.018);
      data = prices.map((price, i) => {
        const d = new Date(now);
        d.setDate(d.getDate() - (days - 1 - i));
        d.setHours(15, 30, 0, 0);
        return {
          timestamp: d.toISOString(),
          price,
          volume: Math.floor(500000 + rng() * 3000000),
        };
      });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Stock prices API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch price history" },
      { status: 500 }
    );
  }
}
