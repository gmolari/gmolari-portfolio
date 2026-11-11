import "./globals.css";
import type { Metadata } from "next";
import { Pixelify_Sans, Rubik } from "next/font/google";
import Link from "next/link";
import { PixelArt } from "@/components/PixelArt";

const display = Pixelify_Sans({ subsets: ["latin"], variable: "--font-display", weight: ["400", "700"] });
const body = Rubik({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "404 · Guilherme Molari",
  robots: { index: false },
};

const theme = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}document.documentElement.dataset.theme=t}catch(e){}})()`;

export default function GlobalNotFound() {
  return (
    <html lang="en" data-theme="dark" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: theme }} />
      </head>
      <body style={{ display: "grid", placeItems: "center", padding: 24 }}>
        <main className="window p-6" style={{ textAlign: "center", maxWidth: 460 }}>
          <PixelArt name="chest" scale={5} />
          <h1 className="font-pixel" style={{ fontSize: 40, margin: "12px 0 4px" }}>404</h1>
          <p style={{ margin: "0 0 4px" }}>This room is empty. Nothing to loot here.</p>
          <p style={{ margin: "0 0 18px", color: "var(--muted)" }}>Esta sala está vazia. Nada para saquear aqui.</p>
          <Link className="btn-pixel btn-gold" href="/">
            ◂ Home
          </Link>
        </main>
      </body>
    </html>
  );
}
