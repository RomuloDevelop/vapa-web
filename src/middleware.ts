import { type NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const LOGIN_URL = "/login";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Strip locale prefix to check the actual route
  const pathnameWithoutLocale =
    pathname.replace(/^\/(en|es)/, "") || "/";

  // ── ADMIN ROUTES ─────────────────────────────────────
  if (pathnameWithoutLocale.startsWith("/admin")) {
    const sessionCookie = getSessionCookie(request);
    if (!sessionCookie) {
      const loginUrl = new URL(LOGIN_URL, request.url);
      loginUrl.searchParams.set("callbackUrl", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── INTL ROUTING ─────────────────────────────────────
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|monitoring|.*\\..*).*)"],
};
