import { type NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const LOGIN_URL = "/login";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cookie-based check (fast, no DB call).
  // Actual session + role validation happens in server components/actions.
  const sessionCookie = getSessionCookie(request);

  // ── ADMIN ROUTES ─────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!sessionCookie) {
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
  ],
};
