import { sprites } from "@/components/sprites";

/** Sprite as absolutely positioned divs, for ImageResponse (Satori has no SVG rect merging guarantees). */
export function SpriteDivs({ name, scale, rows }: { name: keyof typeof sprites; scale: number; rows?: number }) {
  const s = sprites[name];
  const lines = rows ? s.rows.slice(0, rows) : s.rows;
  const w = s.rows[0].length;
  const cells: React.ReactNode[] = [];
  lines.forEach((row, y) => {
    let x = 0;
    while (x < w) {
      const ch = row[x];
      let run = 1;
      while (x + run < w && row[x + run] === ch) run++;
      const fill = s.palette[ch];
      if (ch !== "." && fill)
        cells.push(
          <div
            key={`${x}-${y}`}
            style={{ position: "absolute", left: x * scale, top: y * scale, width: run * scale, height: scale, background: fill }}
          />,
        );
      x += run;
    }
  });
  return <div style={{ position: "relative", display: "flex", width: w * scale, height: lines.length * scale }}>{cells}</div>;
}
