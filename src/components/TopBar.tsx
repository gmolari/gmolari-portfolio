import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { PixelArt } from "./PixelArt";
import { ui } from "@/content/profile";
import type { Locale } from "@/lib/i18n";

/** Shared header. `path` is the current path without the locale ("" or "/cv"). */
export function TopBar({ lang, path, cv }: { lang: Locale; path: string; cv?: boolean }) {
  const t = ui[lang];
  const other: Locale = lang === "en" ? "pt" : "en";
  return (
    <header className="topbar">
      <div className="topbar-in">
        <Link href={`/${lang}`} className="brand" aria-label="Guilherme Molari">
          <PixelArt name="avatar" scale={1.5} />
          <b>MOLARI</b>
        </Link>
        {cv ? (
          <Link href={`/${lang}`} className="chip-btn">
            ◂ {t.backToGame}
          </Link>
        ) : (
          <Link href={`/${lang}/cv`} className="chip-btn">
            {t.skip} ▸▸
          </Link>
        )}
        <Link href={`/${other}${path}`} className="chip-btn" hrefLang={other} lang={other} aria-label={t.otherLang}>
          {t.otherLangShort}
        </Link>
        <ThemeToggle label={t.theme} />
      </div>
    </header>
  );
}
