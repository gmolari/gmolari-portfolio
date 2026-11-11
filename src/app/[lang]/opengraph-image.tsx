import { ImageResponse } from "next/og";
import { hasLocale, locales } from "@/lib/i18n";
import { person, vitals } from "@/content/profile";
import { SpriteDivs } from "@/lib/sprite-image";

export const alt = "Guilherme Molari — Senior Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  const lang = hasLocale(raw) ? raw : "en";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "0 90px",
          background: "linear-gradient(#16302e, #0a1615)",
          color: "#e6f2ee",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 300,
            height: 380,
            border: "8px solid #f0b841",
            borderRadius: 18,
            background: "radial-gradient(circle at 50% 40%, #2c5a55, #0c1817 70%)",
          }}
        >
          <SpriteDivs name="avatar" scale={14} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ fontSize: 30, letterSpacing: 6, color: "#f0b841", textTransform: "uppercase" }}>
            {person.spec[lang]}
          </div>
          <div style={{ fontSize: 86, fontWeight: 800, lineHeight: 1, marginTop: 14 }}>{person.name}</div>
          <div style={{ fontSize: 38, color: "#8fb3ab", marginTop: 16 }}>{person.jobTitle[lang]}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 44 }}>
            {vitals.map((v) => (
              <div key={v.key} style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26 }}>
                <div style={{ width: 54, color: "#f0b841" }}>{v.key}</div>
                <div style={{ display: "flex", width: 520, height: 22, background: "#0c1817", border: "3px solid #2c5a55", borderRadius: 6 }}>
                  <div
                    style={{
                      width: `${v.value}%`,
                      height: "100%",
                      background: { HP: "#e5534b", MP: "#4ba3e5", XP: "#7bd36a" }[v.key],
                      borderRadius: 3,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
