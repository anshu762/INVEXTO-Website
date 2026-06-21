import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { requireSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await requireSession(request);
    if (!(user as any).isAdmin) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          portfolios: {
            include: {
              _count: { select: { holdings: true } },
            },
          },
          registrations: {
            include: { tournament: true },
            orderBy: { registeredAt: "desc" },
          },
        },
      }),
      prisma.user.count(),
    ]);

    const data = users.map((u) => {
      const activePortfolio = u.portfolios.find(p => p.inTournament) || u.portfolios[0];
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        upiId: u.upiId,
        isAdmin: u.isAdmin,
        createdAt: u.createdAt.toISOString(),
        portfolio: activePortfolio
          ? {
              cashBalance: Number(activePortfolio.cashBalance),
              totalHoldings: activePortfolio._count?.holdings || 0,
              inTournament: activePortfolio.inTournament,
            }
          : null,
        tournamentRegistrations: u.registrations.map((r) => ({
          tournamentId: r.tournamentId,
          registeredAt: r.registeredAt.toISOString(),
          finalRank: r.finalRank,
          prizeAmount: r.prizeAmount ? Number(r.prizeAmount) : null,
        })),
      };
    });

    return NextResponse.json({
      success: true,
      data: { users: data, total, page, limit },
    });
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 });
  }
}
