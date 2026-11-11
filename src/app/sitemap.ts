import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { absolute, languageAlternates, lastUpdated } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    { path: "", priority: 1 },
    { path: "/cv", priority: 0.8 },
  ];
  return paths.flatMap(({ path, priority }) =>
    locales.map((lang) => ({
      url: absolute(`/${lang}${path}`),
      lastModified: lastUpdated,
      changeFrequency: "monthly" as const,
      priority: lang === "en" ? priority : priority - 0.1,
      alternates: { languages: languageAlternates(path) },
    })),
  );
}
