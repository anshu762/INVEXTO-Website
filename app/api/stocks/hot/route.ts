import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { SimpleCache } from "@/src/lib/simple-cache";

export async function GET() {
  try {
    const cached = SimpleCache.get<string[]>("hot-stocks");
    if (cached) {
      return NextResponse.json({ success: true, data: { hotStocks: cached } });
    }

    const tournament = await prisma.tournament.findFirst({
      where: { status: "active" },
    });

    if (!tournament) {
      SimpleCache.set("hot-stocks", [], 300);
      return NextResponse.json({ success: true, data: { hotStocks: [] } });
    }

    const totalParticipants = await prisma.tournamentRegistration.count({
      where: { tournamentId: tournament.id },
    });

    if (totalParticipants < 2) {
      SimpleCache.set("hot-stocks", [], 300);
      return NextResponse.json({ success: true, data: { hotStocks: [] } });
    }

    const portfolios = await prisma.portfolio.findMany({
      where: {
        inTournament: true,
        tournamentId: tournament.id,
      },
      include: {
        holdings: {
          where: { quantity: { gt: 0 } },
          include: {
            stock: { select: { symbol: true } },
          },
        },
      },
    });

    const symbolCounts = new Map<string, number>();
    for (const portfolio of portfolios) {
      const seen = new Set<string>();
      for (const holding of portfolio.holdings) {
        const sym = holding.stock.symbol;
        if (!seen.has(sym)) {
          seen.add(sym);
          symbolCounts.set(sym, (symbolCounts.get(sym) ?? 0) + 1);
        }
      }
    }

    const threshold = totalParticipants / 2;
    const hotStocks: string[] = [];
    for (const [symbol, count] of symbolCounts) {
      if (count > threshold) {
        hotStocks.push(symbol);
      }
    }

    SimpleCache.set("hot-stocks", hotStocks, 300);

    return NextResponse.json({ success: true, data: { hotStocks } });
  } catch {
    return NextResponse.json({ success: true, data: { hotStocks: [] } });
  }
}
