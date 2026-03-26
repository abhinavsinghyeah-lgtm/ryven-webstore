import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ALLOWED_PREFIXES = [
  "/coming-soon",
  "/access",
  "/_next",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/icon",
  "/apple-touch-icon",
  "/manifest",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (ALLOWED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const accessCookie = request.cookies.get("ryven_access")?.value;
  if (accessCookie === "true") {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/coming-soon";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/:path*"],
};
