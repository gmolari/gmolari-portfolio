import { ImageResponse } from "next/og";
import { SpriteDivs } from "@/lib/sprite-image";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(#1c3a37, #0a1615)" }}>
        <SpriteDivs name="avatar" scale={7} />
      </div>
    ),
    size,
  );
}
