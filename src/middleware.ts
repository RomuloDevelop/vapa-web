import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const LOGIN_URL = "/login";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });

  // ── ADMIN ROUTES ─────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const loginUrl = new URL(LOGIN_URL, request.url);
      loginUrl.searchParams.set("callbackUrl", request.url);
      return NextResponse.redirect(loginUrl);
    }

    if (token.role !== "admin") {
      const loginUrl = new URL(LOGIN_URL, request.url);
      loginUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // ── MEMBER-PROTECTED ROUTES ──────────────────────────
  if (
    pathname.startsWith("/digital-library/presentations") ||
    pathname.startsWith("/digital-library/references")
  ) {
    if (!token) {
      const loginUrl = new URL(LOGIN_URL, request.url);
      loginUrl.searchParams.set("callbackUrl", request.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/digital-library/presentations/:path*",
    "/digital-library/references/:path*",
  ],
};
