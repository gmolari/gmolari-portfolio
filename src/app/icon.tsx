import { ImageResponse } from "next/og";
import { SpriteDivs } from "@/lib/sprite-image";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Favicon: the avatar's head. */
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#10201f", borderRadius: 6 }}>
        <SpriteDivs name="avatar" scale={2} rows={11} />
      </div>
    ),
    size,
  );
}
