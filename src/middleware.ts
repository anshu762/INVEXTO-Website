import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/src/lib/auth";

const protectedRoutes = ["/portfolio", "/stocks", "/simulate", "/tournament"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("invexto_token")?.value;
  const { pathname } = request.nextUrl;

  if (
    protectedRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))
  ) {
    if (!token) {
      const loginUrl = new URL("/", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    const payload = verifyToken(token);
    if (!payload || !payload.isAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portfolio/:path*", "/stocks/:path*", "/simulate/:path*", "/tournament/:path*", "/admin/:path*"],
};
