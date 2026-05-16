import { NextResponse } from "next/server";
import { getSession } from "@/src/lib/session";
import type { NextRequest } from "next/server";
import type { ApiResponse, User } from "@/src/types";

export async function GET(request: NextRequest) {
  const user = await getSession(request);

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  return NextResponse.json(
    { success: true, data: user } satisfies ApiResponse<User>
  );
}
