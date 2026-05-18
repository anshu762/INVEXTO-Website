"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowUpDown, TrendingUp, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatINR, formatPercent } from "@/lib/format";
import type { HoldingWithPrice } from "@/src/types";

type SortKey = keyof Pick<
  HoldingWithPrice,
  "symbol" | "quantity" | "avgBuyPrice" | "currentPrice" | "currentValue" | "gainLoss" | "gainLossPct"
>;

interface HoldingsTableProps {
  holdings: HoldingWithPrice[];
  loading: boolean;
  onBuy: (symbol: string, name: string) => void;
  onSell: (symbol: string, name: string) => void;
}

export function HoldingsTable({
  holdings,
  loading,
  onBuy,
  onSell,
}: HoldingsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("currentValue");
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = useMemo(() => {
    const result = [...holdings];
    result.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string" && typeof bv === "string") {
        return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortAsc
        ? (av as number) - (bv as number)
        : (bv as number) - (av as number);
    });
    return result;
  }, [holdings, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const SortHeader = ({
    label,
    sortVal,
  }: {
    label: string;
    sortVal: SortKey;
  }) => (
    <th
      className="cursor-pointer px-3 py-3 text-left text-xs font-medium text-muted-foreground/80 transition-colors hover:text-foreground"
      onClick={() => toggleSort(sortVal)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className="h-3 w-3" />
      </div>
    </th>
  );

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full bg-emerald-800/30" />
        ))}
      </div>
    );
  }

  if (holdings.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
        <TrendingUp className="h-10 w-10 text-emerald-700" />
        <p className="text-lg font-medium">You have no holdings</p>
        <p>Start exploring stocks to build your portfolio</p>
        <Button asChild className="bg-amber-500 text-emerald-950 hover:bg-amber-400">
          <Link href="/stocks">Explore Stocks →</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-emerald-800/30">
      <table className="w-full text-sm">
        <thead className="bg-emerald-900/30">
          <tr>
            <SortHeader label="Stock" sortVal="symbol" />
            <SortHeader label="Qty" sortVal="quantity" />
            <SortHeader label="Avg Price" sortVal="avgBuyPrice" />
            <SortHeader label="Current" sortVal="currentPrice" />
            <SortHeader label="Value" sortVal="currentValue" />
            <SortHeader label="Gain/Loss" sortVal="gainLoss" />
            <SortHeader label="Gain %" sortVal="gainLossPct" />
            <th className="px-3 py-3 text-right text-xs font-medium text-muted-foreground/80">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-emerald-800/20">
          {sorted.map((h) => (
            <tr
              key={h.id}
              className="transition-colors hover:bg-emerald-900/20"
            >
              <td className="px-3 py-3">
                <Link
                  href={`/stocks/${h.symbol}`}
                  className="font-medium text-foreground hover:text-amber-400 transition-colors"
                >
                  <span className="block text-xs text-muted-foreground/60">
                    {h.sector}
                  </span>
                  {h.symbol.replace(".NS", "")}
                </Link>
              </td>
              <td className="px-3 py-3 font-mono text-foreground">
                {h.quantity}
              </td>
              <td className="px-3 py-3 font-mono text-muted-foreground">
                {formatINR(h.avgBuyPrice)}
              </td>
              <td className="px-3 py-3 font-mono text-foreground">
                {formatINR(h.currentPrice)}
              </td>
              <td className="px-3 py-3 font-mono text-foreground">
                {formatINR(h.currentValue)}
              </td>
              <td
                className={`px-3 py-3 font-mono ${
                  h.gainLoss >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {formatINR(h.gainLoss)}
              </td>
              <td
                className={`px-3 py-3 font-mono ${
                  h.gainLossPct >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {formatPercent(h.gainLossPct)}
              </td>
              <td className="px-3 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-emerald-400 hover:bg-emerald-800/40 hover:text-emerald-300"
                    onClick={() => onBuy(h.symbol, h.name)}
                    title="Buy more"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-red-400 hover:bg-red-900/30 hover:text-red-300"
                    onClick={() => onSell(h.symbol, h.name)}
                    title="Sell"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
