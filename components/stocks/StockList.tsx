"use client";

import { useState, useMemo } from "react";
import { Search, RefreshCw, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StockCard } from "@/components/stocks/StockCard";
import type { StockWithPrice } from "@/src/types";

const sectors = [
  "All", "IT", "Banking", "FMCG", "Auto", "Pharma",
  "Energy", "Telecom", "Infrastructure", "Metals", "Consumer",
];

const sortOptions = [
  { value: "symbol", label: "Symbol" },
  { value: "price", label: "Price ↓" },
  { value: "change", label: "% Change ↓" },
  { value: "marketCap", label: "Market Cap ↓" },
];

interface StockListProps {
  initialStocks: StockWithPrice[];
}

export function StockList({ initialStocks }: StockListProps) {
  const [stocks, setStocks] = useState<StockWithPrice[]>(initialStocks);
  const [loading, setLoading] = useState(false);
  const [sector, setSector] = useState("All");
  const [sort, setSort] = useState("symbol");
  const [search, setSearch] = useState("");
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const filtered = useMemo(() => {
    let result = [...stocks];

    if (sector !== "All") {
      result = result.filter((s) => s.sector === sector);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.symbol.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "price":
        result.sort((a, b) => b.currentPrice - a.currentPrice);
        break;
      case "change":
        result.sort((a, b) => b.changePercent - a.changePercent);
        break;
      case "marketCap":
        result.sort((a, b) => b.marketCap - a.marketCap);
        break;
      default:
        result.sort((a, b) => a.symbol.localeCompare(b.symbol));
    }

    return result;
  }, [stocks, sector, sort, search]);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stocks");
      const json = await res.json();
      if (json.success) setStocks(json.data);
      setLastUpdated(new Date());
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search stocks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-emerald-900/30 pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-9 rounded-lg border border-emerald-800/30 bg-emerald-900/30 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-amber-400/50"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            size="icon"
            onClick={refresh}
            disabled={loading}
            className="border-emerald-800/30"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {sectors.map((s) => (
          <button
            key={s}
            onClick={() => setSector(s)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              sector === s
                ? "bg-amber-500 text-emerald-950"
                : "bg-emerald-800/30 text-emerald-300/80 hover:bg-emerald-800/50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {filtered.length} stock{filtered.length !== 1 ? "s" : ""} shown
        </span>
        <span>
          Last updated: {lastUpdated.toLocaleTimeString()}
        </span>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-emerald-800/30 bg-emerald-900/20 p-4"
            >
              <Skeleton className="mb-2 h-4 w-3/4 bg-emerald-800/40" />
              <Skeleton className="mb-3 h-3 w-1/4 bg-emerald-800/40" />
              <Skeleton className="h-6 w-1/2 bg-emerald-800/40" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          No stocks match your filters
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((stock) => (
            <StockCard key={stock.id} stock={stock} />
          ))}
        </div>
      )}
    </div>
  );
}
