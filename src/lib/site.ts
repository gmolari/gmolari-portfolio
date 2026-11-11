import { locales, type Locale } from "./i18n";

/**
 * Canonical origin. Set NEXT_PUBLIC_SITE_URL to https://gmolari.dev once the domain is live;
 * until then Vercel's production URL is used automatically.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

export const absolute = (path: string) => `${siteUrl}${path}`;

/** hreflang map for a path that exists in every locale, e.g. "" or "/cv". */
export function languageAlternates(path: string) {
  return {
    ...Object.fromEntries(locales.map((l) => [l === "pt" ? "pt-BR" : "en-US", absolute(`/${l}${path}`)])),
    "x-default": absolute(`/en${path}`),
  };
}

export const cvPdf = (lang: Locale) => `/cv/guilherme-molari-cv-${lang}.pdf`;

/** Stable date used for sitemap lastModified (avoid new Date() during prerender). */
export const lastUpdated = "2026-11-11";
