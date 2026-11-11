// Generates public/cv/guilherme-molari-cv-{en,pt}.pdf from the /cv pages.
// Usage: npm run build && npm start (in another terminal) && npm run cv:pdf
import { chromium } from "playwright";
const base = process.argv[2] ?? "http://localhost:3000";
const browser = await chromium.launch();
for (const lang of ["en", "pt"]) {
  const ctx = await browser.newContext();
  await ctx.addInitScript(() => localStorage.setItem("theme", "light"));
  const page = await ctx.newPage();
  await page.goto(`${base}/${lang}/cv`, { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print" });
  await page.pdf({ path: `public/cv/guilherme-molari-cv-${lang}.pdf`, format: "A4", printBackground: false, margin: { top: "16mm", bottom: "16mm", left: "16mm", right: "16mm" } });
  await ctx.close();
  console.log(`public/cv/guilherme-molari-cv-${lang}.pdf`);
}
await browser.close();
