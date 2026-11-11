import { NextResponse, type NextRequest } from "next/server";
import { hasLocale, matchLocale } from "@/lib/i18n";

/** Sends locale-less URLs to /en or /pt based on the browser language. */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";
  if (hasLocale(first)) return;

  const locale = matchLocale(request.headers.get("accept-language"));
  request.nextUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Skip Next internals, files with an extension (sitemap.xml, robots.txt, PDFs, images) and generated icons.
  matcher: ["/((?!_next|.*\\..*|icon|apple-icon).*)"],
};
