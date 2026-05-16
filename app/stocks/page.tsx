import { Navbar } from "@/components/layout/Navbar";
import { StockList } from "@/components/stocks/StockList";
import type { StockWithPrice } from "@/src/types";

async function getStocks(): Promise<StockWithPrice[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/stocks`, {
      cache: "no-store",
    });
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export default async function StocksPage() {
  const stocks = await getStocks();

  return (
    <>
      <Navbar />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Stocks
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse and trade NSE-listed stocks
          </p>
        </div>
        <StockList initialStocks={stocks} />
      </main>
    </>
  );
}
