"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import type { SimState } from "@/src/types";
import { calcSimPortfolioValue, STARTING_CASH } from "@/src/lib/simulation";
import { formatINR, formatPercent } from "@/lib/format";
import { Navbar } from "@/components/layout/Navbar";
import {
  Trophy, TrendingUp, TrendingDown, RefreshCw, ArrowLeft,
  BarChart3, DollarSign, Activity, Award,
} from "lucide-react";

interface Props {
  state: SimState;
  onTryAnother: () => void;
}

export default function SimResults({ state, onTryAnother }: Props) {
  const router = useRouter();

  const finalValue = calcSimPortfolioValue(state);
  const gainLoss = finalValue - STARTING_CASH;
  const gainLossPct = (gainLoss / STARTING_CASH) * 100;

  const metrics = useMemo(() => {
    const vals = state.valueHistory;
    const peak = Math.max(...vals);
    const trough = Math.min(...vals);
    const peakIdx = vals.indexOf(peak);
    const troughIdx = vals.indexOf(trough);
    const drawdown = peak > 0 ? ((trough - peak) / peak) * 100 : 0;
    const profitableTrades = state.transactions.filter(
      (t) => t.type === "sell" && t.total > 0
    ).length;
    const totalTrades = state.transactions.filter((t) => t.type === "sell").length || 1;
    const winRate = (profitableTrades / totalTrades) * 100;
    const volatility = calculateVolatility(vals);
    const avgReturn = vals.length > 1 ? (gainLossPct / (vals.length - 1)) * 100 : 0;
    const sharpe =
      volatility > 0 && vals.length > 1
        ? (avgReturn / volatility) * Math.sqrt(vals.length - 1)
        : 0;
    return { peak, trough, peakIdx, troughIdx, drawdown, winRate, volatility, sharpe };
  }, [state]);

  const grade =
    gainLossPct >= 30
      ? { letter: "S", color: "text-amber-300", label: "Elite Trader" }
      : gainLossPct >= 15
        ? { letter: "A", color: "text-emerald-400", label: "Expert Trader" }
        : gainLossPct >= 5
          ? { letter: "B", color: "text-blue-400", label: "Skilled Trader" }
          : gainLossPct >= 0
            ? { letter: "C", color: "text-gray-300", label: "Average Trader" }
            : gainLossPct >= -15
              ? { letter: "D", color: "text-orange-400", label: "Needs Improvement" }
              : { letter: "F", color: "text-red-400", label: "High Risk Trader" };

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-900/20">
            <Trophy className={`h-8 w-8 ${gainLoss >= 0 ? "text-emerald-400" : "text-gray-500"}`} />
          </div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Simulation Complete</h1>
          <p className="mt-1.5 text-sm text-gray-500">{state.eventName}</p>
        </div>

        {/* Grade + Final Value */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-800 bg-gray-900/60 p-8">
            <div className={`text-7xl font-black ${grade.color} sm:text-8xl`}>
              {grade.letter}
            </div>
            <p className="mt-2 text-sm font-medium text-gray-400">{grade.label}</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-800 bg-gray-900/60 p-8">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Final Portfolio</p>
            <p className="mt-1 text-4xl font-bold text-white sm:text-5xl">{formatINR(finalValue)}</p>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${
                  gainLoss >= 0
                    ? "bg-emerald-900/30 text-emerald-300"
                    : "bg-red-900/30 text-red-300"
                }`}
              >
                {gainLoss >= 0 ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
                {gainLoss >= 0 ? "+" : ""}
                {formatPercent(gainLossPct)}
              </span>
              <span className="text-sm text-gray-600">
                ({gainLoss >= 0 ? "+" : ""}{formatINR(gainLoss)})
              </span>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MetricCard
            icon={<DollarSign className="h-4 w-4" />}
            label="Starting Cash"
            value={formatINR(STARTING_CASH)}
          />
          <MetricCard
            icon={<Activity className="h-4 w-4" />}
            label="Max Drawdown"
            value={formatPercent(metrics.drawdown)}
            negative
          />
          <MetricCard
            icon={<Award className="h-4 w-4" />}
            label="Sharpe Ratio"
            value={metrics.sharpe.toFixed(2)}
            positive={metrics.sharpe > 1}
          />
          <MetricCard
            icon={<TrendingUp className="h-4 w-4" />}
            label="Win Rate"
            value={formatPercent(metrics.winRate)}
            positive={metrics.winRate > 50}
          />
        </div>

        {/* Portfolio Chart */}
        {state.valueHistory.length > 1 && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/60">
            <div className="border-b border-gray-800 px-5 py-3">
              <h3 className="flex items-center gap-1.5 text-sm font-semibold text-gray-300">
                <BarChart3 className="h-4 w-4" />
                Portfolio Value Over Time
              </h3>
            </div>
            <div className="relative h-64 w-full p-4 sm:p-6">
              <svg
                viewBox={`0 0 ${state.valueHistory.length - 1} 100`}
                preserveAspectRatio="none"
                className="h-full w-full"
              >
                <defs>
                  <linearGradient id="resultGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={gainLoss >= 0 ? "#10b981" : "#ef4444"} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={gainLoss >= 0 ? "#10b981" : "#ef4444"} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d={(() => {
                    const vals = state.valueHistory;
                    const min = Math.min(...vals);
                    const max = Math.max(...vals);
                    const range = max - min || 1;
                    return vals
                      .map((v, i) => {
                        const x = i;
                        const y = 100 - ((v - min) / range) * 88 - 6;
                        return `${i === 0 ? "M" : "L"}${x},${y}`;
                      })
                      .join(" ");
                  })()}
                  fill="none"
                  stroke={gainLoss >= 0 ? "#10b981" : "#ef4444"}
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d={(() => {
                    const vals = state.valueHistory;
                    const min = Math.min(...vals);
                    const max = Math.max(...vals);
                    const range = max - min || 1;
                    const points = vals.map((v, i) => {
                      const x = i;
                      const y = 100 - ((v - min) / range) * 88 - 6;
                      return `${x},${y}`;
                    });
                    return `M${points[0]} L${points.slice(1).join(" L")} L${vals.length - 1},100 L0,100 Z`;
                  })()}
                  fill="url(#resultGradient)"
                />
                {(() => {
                  const vals = state.valueHistory;
                  const last = vals[vals.length - 1];
                  const min = Math.min(...vals);
                  const max = Math.max(...vals);
                  const range = max - min || 1;
                  const lastX = vals.length - 1;
                  const lastY = 100 - ((last - min) / range) * 88 - 6;
                  return <circle cx={lastX} cy={lastY} r="3" fill={gainLoss >= 0 ? "#10b981" : "#ef4444"} />;
                })()}
              </svg>
            </div>
          </div>
        )}

        {/* Trade Log */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/60">
          <div className="border-b border-gray-800 px-5 py-3">
            <h3 className="flex items-center gap-1.5 text-sm font-semibold text-gray-300">
              <Activity className="h-4 w-4" />
              Trade History
              <span className="ml-1 text-xs font-normal text-gray-600">
                ({state.transactions.length} trades)
              </span>
            </h3>
          </div>
          {state.transactions.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-gray-600">
              You did not make any trades during this simulation.
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-900/95 text-[10px] font-medium uppercase tracking-wider text-gray-500 backdrop-blur-sm">
                  <tr>
                    <th className="px-4 py-2.5 text-left">Day</th>
                    <th className="px-4 py-2.5 text-left">Type</th>
                    <th className="px-4 py-2.5 text-left">Symbol</th>
                    <th className="px-4 py-2.5 text-right">Qty</th>
                    <th className="px-4 py-2.5 text-right">Price</th>
                    <th className="px-4 py-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {state.transactions.map((tx, i) => (
                    <tr key={i} className="border-t border-gray-800/50 transition hover:bg-gray-800/20">
                      <td className="px-4 py-2.5 font-mono text-xs text-gray-500">
                        Day {tx.day + 1}
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                            tx.type === "buy"
                              ? "bg-emerald-900/30 text-emerald-300"
                              : "bg-red-900/30 text-red-300"
                          }`}
                        >
                          {tx.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 font-medium text-white">
                        {tx.symbol.replace(".NS", "")}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-gray-300">
                        {tx.qty}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-gray-400">
                        {formatINR(tx.price)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono font-medium text-white">
                        {formatINR(tx.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onTryAnother}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 font-semibold text-white transition hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-900/20"
          >
            <RefreshCw className="h-4 w-4" />
            Try Another Event
          </button>
          <button
            onClick={() => router.push("/portfolio")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-800 py-3.5 font-semibold text-gray-300 transition hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Portfolio
          </button>
        </div>
      </div>
    </>
  );
}

function MetricCard({
  icon,
  label,
  value,
  positive,
  negative,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  positive?: boolean;
  negative?: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4">
      <div className="mb-1 flex items-center gap-1.5 text-gray-500">
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
      </div>
      <p
        className={`text-lg font-bold ${
          positive ? "text-emerald-400" : negative ? "text-red-400" : "text-white"
        }`}
      >
        {value.startsWith("-") ? value : positive || negative ? value : value}
      </p>
    </div>
  );
}

function calculateVolatility(values: number[]): number {
  if (values.length < 2) return 0;
  const returns = [];
  for (let i = 1; i < values.length; i++) {
    returns.push((values[i] - values[i - 1]) / values[i - 1]);
  }
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance =
    returns.reduce((acc, r) => acc + (r - mean) ** 2, 0) / returns.length;
  return Math.sqrt(variance);
}
