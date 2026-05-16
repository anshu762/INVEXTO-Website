import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { requireSession } from "@/src/lib/session";

export async function POST(request: NextRequest) {
  try {
    const user = await requireSession(request);
    const { stockId, quantity } = await request.json();

    if (!stockId || !quantity || quantity <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid stock or quantity" },
        { status: 400 }
      );
    }

    const stock = await prisma.stock.findUnique({
      where: { id: stockId },
      include: {
        stockPrices: { orderBy: { timestamp: "desc" }, take: 1 },
      },
    });

    if (!stock || !stock.stockPrices[0]) {
      return NextResponse.json(
        { success: false, error: "Stock not found or no price data" },
        { status: 404 }
      );
    }

    const currentPrice = Number(stock.stockPrices[0].price);
    const total = currentPrice * quantity;

    const portfolio = await prisma.portfolio.findFirst({
      where: { userId: user.id, mode: "regular" },
    });

    if (!portfolio) {
      return NextResponse.json(
        { success: false, error: "Portfolio not found" },
        { status: 404 }
      );
    }

    const cashBalance = Number(portfolio.cashBalance);
    if (cashBalance < total) {
      return NextResponse.json(
        { success: false, error: "Insufficient cash balance" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      await tx.portfolio.update({
        where: { id: portfolio.id },
        data: { cashBalance: cashBalance - total },
      });

      const existing = await tx.holding.findUnique({
        where: {
          portfolioId_stockId: {
            portfolioId: portfolio.id,
            stockId: stock.id,
          },
        },
      });

      if (existing) {
        const oldQty = existing.quantity;
        const oldAvg = Number(existing.avgBuyPrice);
        const newAvg = (oldAvg * oldQty + currentPrice * quantity) / (oldQty + quantity);
        await tx.holding.update({
          where: { id: existing.id },
          data: {
            quantity: oldQty + quantity,
            avgBuyPrice: newAvg,
          },
        });
      } else {
        await tx.holding.create({
          data: {
            portfolioId: portfolio.id,
            stockId: stock.id,
            quantity,
            avgBuyPrice: currentPrice,
          },
        });
      }

      const txn = await tx.transaction.create({
        data: {
          portfolioId: portfolio.id,
          stockId: stock.id,
          type: "buy",
          quantity,
          price: currentPrice,
          total,
        },
      });

      return txn;
    });

    return NextResponse.json({
      success: true,
      data: {
        transactionId: result.id,
        quantity,
        price: currentPrice,
        total,
        cashBalance: cashBalance - total,
      },
    });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Buy API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process buy" },
      { status: 500 }
    );
  }
}
