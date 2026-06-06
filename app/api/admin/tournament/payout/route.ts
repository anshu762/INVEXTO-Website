import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { requireSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireSession(request);
    if (!(user as any).isAdmin) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { userId, tournamentId, amount } = await request.json();

    if (!userId || !tournamentId || !amount) {
      return NextResponse.json(
        { success: false, error: "userId, tournamentId, and amount are required" },
        { status: 400 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { upiId: true },
    });

    if (!dbUser || !dbUser.upiId) {
      return NextResponse.json(
        { success: false, error: "User has no UPI ID" },
        { status: 400 }
      );
    }

    const payment = await prisma.prizePayment.create({
      data: {
        userId,
        tournamentId,
        amount,
        upiId: dbUser.upiId,
        paidByAdmin: (user as any).email,
      },
    });

    return NextResponse.json({ success: true, data: payment });
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ success: false, error: "Failed to process payout" }, { status: 500 });
  }
}
