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

    const portfolio = await prisma.portfolio.findFirst({
      where: { userId: user.id, mode: "regular" },
    });

    if (!portfolio) {
      return NextResponse.json(
        { success: false, error: "Portfolio not found" },
        { status: 404 }
      );
    }

    const holding = await prisma.holding.findUnique({
      where: {
        portfolioId_stockId: {
          portfolioId: portfolio.id,
          stockId: stock.id,
        },
      },
    });

    if (!holding || holding.quantity < quantity) {
      return NextResponse.json(
        { success: false, error: "Insufficient shares to sell" },
        { status: 400 }
      );
    }

    const avgBuyPrice = Number(holding.avgBuyPrice);
    const total = currentPrice * quantity;
    const realizedGain = (currentPrice - avgBuyPrice) * quantity;
    const newQuantity = holding.quantity - quantity;
    const cashBalance = Number(portfolio.cashBalance);

    const result = await prisma.$transaction(async (tx) => {
      await tx.portfolio.update({
        where: { id: portfolio.id },
        data: { cashBalance: cashBalance + total },
      });

      if (newQuantity === 0) {
        await tx.holding.delete({ where: { id: holding.id } });
      } else {
        await tx.holding.update({
          where: { id: holding.id },
          data: { quantity: newQuantity },
        });
      }

      const txn = await tx.transaction.create({
        data: {
          portfolioId: portfolio.id,
          stockId: stock.id,
          type: "sell",
          quantity,
          price: currentPrice,
          total,
          realizedGain,
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
        realizedGain,
        cashBalance: cashBalance + total,
      },
    });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Sell API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process sell" },
      { status: 500 }
    );
  }
}
