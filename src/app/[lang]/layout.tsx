import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Pixelify_Sans, Rubik } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../globals.css";
import { hasLocale, localeTags, locales, ogLocales } from "@/lib/i18n";
import { absolute, languageAlternates, siteUrl } from "@/lib/site";
import { person, skillList } from "@/content/profile";

const display = Pixelify_Sans({ subsets: ["latin"], variable: "--font-display", weight: ["400", "500", "700"] });
const body = Rubik({ subsets: ["latin"], variable: "--font-body" });

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const descriptions = {
  en: "Guilherme Molari, senior software engineer from Londrina, Brazil. Full stack with Next.js, React and TypeScript, specialized in gamification, iGaming and web games built with PixiJS.",
  pt: "Guilherme Molari, engenheiro de software sênior em Londrina. Full stack com Next.js, React e TypeScript, especializado em gamificação, iGaming e jogos web com PixiJS.",
};

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const title = `${person.name} · ${person.jobTitle[lang]}`;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s · ${person.name}` },
    description: descriptions[lang],
    applicationName: person.name,
    authors: [{ name: person.name, url: person.github }],
    creator: person.name,
    keywords: [
      person.name, "Guilherme Molari", "gmolari", "portfolio", "full stack", "gamification", "gamificação", "iGaming",
      "game developer", "Londrina", ...skillList.slice(0, 12),
    ],
    alternates: { canonical: absolute(`/${lang}`), languages: languageAlternates("") },
    openGraph: {
      type: "profile",
      firstName: "Guilherme",
      lastName: "Molari",
      username: person.githubHandle,
      url: absolute(`/${lang}`),
      siteName: person.name,
      title,
      description: descriptions[lang],
      locale: ogLocales[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocales[l]),
    },
    twitter: { card: "summary_large_image", title, description: descriptions[lang] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
    formatDetection: { email: false, telephone: false },
    category: "technology",
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#10201f" },
    { media: "(prefers-color-scheme: light)", color: "#e9f2ef" },
  ],
  colorScheme: "dark light",
};

/** Runs before paint: resolves the theme and skips the boot screen when already seen or motion is reduced. */
const bootScript = `(function(){var d=document.documentElement;try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}d.dataset.theme=t;if(sessionStorage.getItem('booted')||matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('booted')}catch(e){d.dataset.theme='dark';d.classList.add('booted')}})()`;

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html lang={localeTags[lang]} data-theme="dark" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <noscript>
          <style>{`.boot{display:none!important}html{overflow:auto!important}.enter,.enter *{animation-play-state:running!important}`}</style>
        </noscript>
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
