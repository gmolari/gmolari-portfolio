/** 12×12 pixel crescent moon and sun for the theme switch, as merged row runs. */
export type Run = { x: number; y: number; w: number };

function raster(inside: (x: number, y: number) => boolean): Run[] {
  const out: Run[] = [];
  for (let y = 0; y < 12; y++) {
    let x = 0;
    while (x < 12) {
      const on = inside(x + 0.5, y + 0.5);
      let w = 1;
      while (x + w < 12 && inside(x + w + 0.5, y + 0.5) === on) w++;
      if (on) out.push({ x, y, w });
      x += w;
    }
  }
  return out;
}

export const moon = raster((x, y) => (x - 6) ** 2 + (y - 6) ** 2 <= 5.6 ** 2 && (x - 8.4) ** 2 + (y - 4.4) ** 2 > 4.1 ** 2);
export const sun = raster((x, y) => {
  const d = Math.hypot(x - 6, y - 6);
  const a = Math.atan2(y - 6, x - 6);
  return d <= 3.1 || (d >= 4.3 && d <= 5.9 && Math.cos(a * 8) > 0.55);
});
