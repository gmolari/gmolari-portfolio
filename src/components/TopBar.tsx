import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { Glyph } from "./Glyph";
import { person, ui } from "@/content/profile";
import type { Locale } from "@/lib/i18n";

/** Shared header. `path` is the current path without the locale ("" or "/cv"). */
export function TopBar({ lang, path, cv }: { lang: Locale; path: string; cv?: boolean }) {
  const t = ui[lang];
  const other: Locale = lang === "en" ? "pt" : "en";
  return (
    <header
      className="no-print sticky top-0 z-20 border-b-3 border-frame bg-linear-to-b from-panel to-panel-2 shadow-[0_4px_0_var(--shadow)]"
      style={{ viewTransitionName: "site-header" }}
    >
      <div className="mx-auto flex max-w-[1180px] items-center gap-2 px-4 py-2.5 sm:gap-3">
        <Link href={`/${lang}`} className="mr-auto min-w-0 truncate font-pixel text-lg tracking-wide text-ink no-underline transition-colors hover:text-accent sm:text-xl">
          {person.name}
        </Link>
        {cv ? (
          <Link href={`/${lang}`} className="btn-pixel" aria-label={t.backToGame}>
            <Glyph name="back" size={14} />
            <span className="hidden sm:inline">{t.backToGame}</span>
          </Link>
        ) : (
          <Link href={`/${lang}/cv`} className="btn-pixel" aria-label={t.skip}>
            <span className="hidden sm:inline">{t.skip}</span>
            <Glyph name="forward" size={14} />
          </Link>
        )}
        <Link href={`/${other}${path}`} className="btn-pixel" hrefLang={other} lang={other} aria-label={t.otherLang} title={t.otherLang}>
          <Glyph name="globe" size={14} />
          {t.otherLangShort}
        </Link>
        <ThemeToggle label={t.theme} />
      </div>
    </header>
  );
}
