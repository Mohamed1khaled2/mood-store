import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const { defaultLocale, locales } = routing;

const PUBLIC_FILE = /\.(.*)$/;

function withSecurityHeaders(response: NextResponse) {
  const development = process.env.NODE_ENV === "development";
  const policy = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${development ? " 'unsafe-eval'" : ""} https://ethbat.vercel.app`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "media-src 'self' blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://ethbat.vercel.app",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");

  response.headers.set("Content-Security-Policy", policy);
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Content-Type-Options", "nosniff");
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return;
  }

  if (pathname.startsWith("/admin")) {
    return withSecurityHeaders(NextResponse.next());
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (pathnameHasLocale) {
    return withSecurityHeaders(NextResponse.next());
  }

  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return withSecurityHeaders(NextResponse.redirect(request.nextUrl));
}

export const config = {
  matcher: ["/((?!_next).*)"],
};
