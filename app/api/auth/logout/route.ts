import { NextResponse } from "next/server";
import type { ApiResponse } from "@/src/types";

export async function POST() {
  const response = NextResponse.json(
    { success: true } satisfies ApiResponse<null>
  );

  response.cookies.set("invexto_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
