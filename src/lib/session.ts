import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyToken } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import type { User } from "@/src/types";

export async function getSession(
  request: NextRequest
): Promise<User | null> {
  const token = request.cookies.get("invexto_token")?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, name: true, email: true, upiId: true, createdAt: true },
  });

  if (!dbUser) return null;

  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    upiId: dbUser.upiId,
    createdAt: dbUser.createdAt.toISOString(),
  };
}

export async function requireSession(
  request: NextRequest
): Promise<User> {
  const user = await getSession(request);
  if (!user) {
    throw new NextResponse(
      JSON.stringify({ success: false, error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
  return user;
}
