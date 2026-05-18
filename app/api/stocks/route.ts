import { NextResponse } from "next/server";
import { nseStocks, getSectors, getStockBySymbol } from "@/src/data/nse-stocks";
import { fetchQuotes, mapQuoteToStockWithPrice, searchStocks } from "@/src/lib/yahoo-finance";
import type { StockWithPrice } from "@/src/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sector = searchParams.get("sector");
    const sort = searchParams.get("sort") || "symbol";
    const searchQ = searchParams.get("q");

    if (searchQ) {
      const results = await searchStocks(searchQ);
      const symbols = results.map((r: any) => r.symbol);
      const quotes = await fetchQuotes(symbols);
      const stocks: StockWithPrice[] = results.map((r: any) => {
        const q = quotes[r.symbol];
        if (q) return mapQuoteToStockWithPrice(q, { name: r.name, sector: r.sector });
        return {
          id: r.symbol,
          symbol: r.symbol,
          name: r.name,
          sector: r.sector,
          faceValue: 0,
          isActive: true,
          sharesOutstanding: 0,
          currentPrice: 0,
          previousClose: 0,
          changePercent: 0,
          marketCap: 0,
          volume: 0,
          lastUpdated: new Date().toISOString(),
        };
      });
      return NextResponse.json({ success: true, data: stocks });
    }

    let filtered = sector && sector !== "All"
      ? nseStocks.filter((s) => s.sector === sector)
      : nseStocks;

    const symbols = filtered.map((s) => s.symbol);
    const quotes = await fetchQuotes(symbols);

    const data: StockWithPrice[] = filtered.map((s) => {
      const q = quotes[s.symbol];
      if (q) return mapQuoteToStockWithPrice(q, s);
      return {
        id: s.symbol,
        symbol: s.symbol,
        name: s.name,
        sector: s.sector,
        faceValue: 0,
        isActive: true,
        sharesOutstanding: 0,
        currentPrice: 0,
        previousClose: 0,
        changePercent: 0,
        marketCap: 0,
        volume: 0,
        lastUpdated: new Date().toISOString(),
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
