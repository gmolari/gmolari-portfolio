export const locales = ["en", "pt"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/** BCP 47 tags for <html lang>, Open Graph and hreflang. */
export const localeTags: Record<Locale, string> = { en: "en-US", pt: "pt-BR" };
export const ogLocales: Record<Locale, string> = { en: "en_US", pt: "pt_BR" };

/** Picks the best supported locale from an Accept-Language header. */
export function matchLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;
  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { base: tag.toLowerCase().split("-")[0], q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { base } of ranked) if (hasLocale(base)) return base;
  return defaultLocale;
}
