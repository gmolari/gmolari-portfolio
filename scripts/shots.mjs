// Screenshots for visual review: node scripts/shots.mjs <outDir> [baseUrl]
import { chromium } from "playwright";
const out = process.argv[2] ?? "shots";
const base = process.argv[3] ?? "http://localhost:3000";
const browser = await chromium.launch();
const errors = [];
for (const [name, vp, theme, path, boot] of [
  ["boot-desktop", { width: 1366, height: 860 }, "dark", "/en", true],
  ["home-dark", { width: 1366, height: 860 }, "dark", "/en", false],
  ["home-light", { width: 1366, height: 860 }, "light", "/pt", false],
  ["home-mobile", { width: 390, height: 844 }, "dark", "/pt", false],
  ["cv-light", { width: 1366, height: 860 }, "light", "/en/cv", false],
]) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 });
  await ctx.addInitScript(([t, b]) => { localStorage.setItem("theme", t); if (!b) sessionStorage.setItem("booted", "1"); }, [theme, boot]);
  const page = await ctx.newPage();
  page.on("console", (m) => m.type() === "error" && errors.push(`${name}: ${m.text()}`));
  page.on("pageerror", (e) => errors.push(`${name}: ${e.message}`));
  await page.goto(base + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(2600);
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: !boot });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  if (overflow) errors.push(`${name}: horizontal overflow`);
  await ctx.close();
}
await browser.close();
console.log(errors.length ? errors.join("\n") : "no console errors / overflow");
