/**
 * Procedural 32×32 pixel-art "app icons" for each project.
 * Shapes are rasterized onto a grid and shaded with colour ramps + 4×4 Bayer dithering,
 * the way 16-bit artists faked gradients. Runs on the server; the client only gets rects.
 */
export type PixelRect = { x: number; y: number; w: number; c: string };

const N = 32;
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];
const LIGHT = (() => {
  const v = [-0.55, -0.65, 0.55];
  const l = Math.hypot(...v);
  return v.map((n) => n / l);
})();

type Ramp = string[]; // dark → light
type Test = (x: number, y: number) => boolean;
type Value = (x: number, y: number) => number; // 0..1 brightness

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

function pick(ramp: Ramp, v: number, x: number, y: number) {
  const f = clamp(v) * (ramp.length - 1);
  const i = Math.floor(f);
  const d = (BAYER[y & 3][x & 3] + 0.5) / 16;
  return ramp[Math.min(ramp.length - 1, i + (f - i > d ? 1 : 0))];
}

class Pix {
  g: (string | null)[][] = Array.from({ length: N }, () => Array<string | null>(N).fill(null));
  inTile: Test = () => true;

  /** Fill pixels whose centre passes `test`, coloured by ramp/value; optional 1px outline around the shape. */
  shape(test: Test, ramp: Ramp, value: Value, outline?: string) {
    const hit = (x: number, y: number) => x >= 0 && y >= 0 && x < N && y < N && test(x + 0.5, y + 0.5);
    if (outline)
      for (let y = 0; y < N; y++)
        for (let x = 0; x < N; x++)
          if (!hit(x, y) && this.inTile(x + 0.5, y + 0.5) && (hit(x + 1, y) || hit(x - 1, y) || hit(x, y + 1) || hit(x, y - 1)))
            this.g[y][x] = outline;
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (hit(x, y)) this.g[y][x] = pick(ramp, value(x + 0.5, y + 0.5), x, y);
  }
  dot(x: number, y: number, c: string) {
    if (x >= 0 && y >= 0 && x < N && y < N) this.g[y][x] = c;
  }
  glyph(rows: string[], ox: number, oy: number, c: string) {
    rows.forEach((r, y) => [...r].forEach((ch, x) => ch === "#" && this.dot(ox + x, oy + y, c)));
  }
  rects(): PixelRect[] {
    const out: PixelRect[] = [];
    this.g.forEach((row, y) => {
      let x = 0;
      while (x < N) {
        const c = row[x];
        let w = 1;
        while (x + w < N && row[x + w] === c) w++;
        if (c) out.push({ x, y, w, c });
        x += w;
      }
    });
    return out;
  }
}

/* ---------- shape helpers ---------- */
const disk = (cx: number, cy: number, r: number): Test => (x, y) => (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
const ring = (cx: number, cy: number, r0: number, r1: number): Test => (x, y) => {
  const d = Math.hypot(x - cx, y - cy);
  return d >= r0 && d <= r1;
};
const box = (x0: number, y0: number, w: number, h: number): Test => (x, y) => x >= x0 && x < x0 + w && y >= y0 && y < y0 + h;
const rbox = (x0: number, y0: number, w: number, h: number, r: number): Test => (x, y) => {
  if (!box(x0, y0, w, h)(x, y)) return false;
  const cx = clamp(x, x0 + r, x0 + w - r);
  const cy = clamp(y, y0 + r, y0 + h - r);
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
};
const poly = (pts: [number, number][]): Test => (x, y) => {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
const and = (...t: Test[]): Test => (x, y) => t.every((f) => f(x, y));
const not = (t: Test): Test => (x, y) => !t(x, y);

/* ---------- value helpers ---------- */
const sphere = (cx: number, cy: number, r: number, amb = 0.12): Value => (x, y) => {
  const nx = (x - cx) / r;
  const ny = (y - cy) / r;
  const nz = Math.sqrt(clamp(1 - nx * nx - ny * ny));
  return amb + (1 - amb) * clamp(nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2]);
};
const vert = (y0: number, y1: number): Value => (_x, y) => 1 - (y - y0) / (y1 - y0);
const flat = (v: number): Value => () => v;

/** Rounded tile with a dithered vertical gradient, dark outline and a top highlight. */
function tile(p: Pix, ramp: Ramp, outline: string) {
  const t = rbox(1, 1, 30, 30, 7);
  p.inTile = () => true;
  p.shape(t, ramp, vert(2, 30), outline);
  p.inTile = rbox(2, 2, 28, 28, 6);
  for (let x = 6; x < 26; x++) p.dot(x, 2, "rgba(255,255,255,0.28)");
}

const SEVEN = ["###", "..#", ".#.", ".#.", ".#."];

/* ---------- the icons ---------- */
const icons: Record<string, (p: Pix) => void> = {
  "supernova-bet": (p) => {
    tile(p, ["#070b26", "#101a4d", "#1b2f7a", "#2a49a8"], "#05071a");
    const cx = 16, cy = 16;
    const star: [number, number][] = [];
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
      const r = i % 2 === 0 ? (i % 4 === 0 ? 13 : 9) : 4;
      star.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    p.shape(poly(star), ["#9c3a08", "#e2661a", "#ff9a2e", "#ffd25a"], (x, y) => 1 - Math.hypot(x - cx, y - cy) / 13, "#3a1404");
    p.shape(disk(cx, cy, 5.5), ["#f0a020", "#ffd84a", "#fff2a8", "#ffffff"], sphere(cx, cy, 5.5, 0.35), "#7a3a06");
    for (const [x, y] of [[6, 7], [26, 24], [25, 7], [7, 25]]) {
      p.dot(x, y, "#ffffff");
      p.dot(x + 1, y, "#bcd2ff");
      p.dot(x - 1, y, "#bcd2ff");
      p.dot(x, y + 1, "#bcd2ff");
      p.dot(x, y - 1, "#bcd2ff");
    }
  },

  "gamification-loop": (p) => {
    tile(p, ["#072724", "#0e4a44", "#16706a", "#23988e"], "#031513");
    const cx = 16, cy = 16;
    const gap = (x: number, y: number) => {
      const a = Math.atan2(y - cy, x - cx);
      return a > -1.2 && a < -0.35;
    };
    p.shape(and(ring(cx, cy, 9.2, 12.6), not(gap)), ["#8a5a08", "#d99a1a", "#ffd04a", "#fff2b0"], (x, y) => vert(4, 28)(x, y) * 0.85 + 0.1, "#3a2402");
    // arrow head at the end of the loop
    p.shape(poly([[19.5, 2.8], [27.5, 6.5], [20.5, 11.5]]), ["#d99a1a", "#ffd04a", "#fff2b0"], flat(0.7), "#3a2402");
    // chest
    p.shape(rbox(10, 11, 12, 5, 2), ["#5e3112", "#9a5a2a", "#c98a4a"], vert(11, 16), "#2a1406");
    p.shape(box(10, 16, 12, 6), ["#4a260c", "#7a4520", "#a8663a"], vert(15, 23), "#2a1406");
    p.shape(box(10, 15, 12, 1), ["#8a5a08", "#ffd04a"], flat(0.8));
    p.shape(box(15, 14, 2, 4), ["#d99a1a", "#fff2b0"], flat(0.6));
    p.dot(15, 16, "#2a1406");
    p.dot(16, 16, "#2a1406");
  },

  vortexvolley: (p) => {
    tile(p, ["#4a1606", "#8a300c", "#c7531c", "#f0883a"], "#2a0b02");
    const cx = 17.5, cy = 15.5, r = 9.5;
    const lit = sphere(cx, cy, r, 0.18);
    p.shape(disk(cx, cy, r), ["#7f8aa3", "#c3cbe0", "#eef2fb", "#ffffff"], lit, "#1c0a04");
    const band = (bx: number, by: number, br: number) => and(disk(cx, cy, r), ring(bx, by, br - 1.4, br + 1.4));
    p.shape(band(cx - 13, cy - 9, 15), ["#163a8a", "#2a63d4", "#5a92ff"], lit);
    p.shape(band(cx + 12, cy + 12, 15), ["#9a6a06", "#e8b21c", "#ffe066"], lit);
    // speed swirl
    for (const [x, y, w] of [[3, 12, 4], [2, 16, 5], [3, 20, 4], [5, 24, 3]] as const)
      for (let i = 0; i < w; i++) p.dot(x + i, y, i === w - 1 ? "#ffd2a8" : "#f7a868");
  },

  bigette: (p) => {
    tile(p, ["#4a0f22", "#8a2040", "#c23b5c", "#ef7590"], "#2a0612");
    const body = ["#14161f", "#262a3a", "#3a4058", "#56607e"];
    p.shape(rbox(8, 7, 8, 5, 1.5), body, vert(7, 12), "#07080c");
    p.shape(rbox(4, 10, 24, 15, 3), body, vert(10, 25), "#07080c");
    p.shape(box(5, 14, 22, 2), ["#0c0d12", "#1a1d28"], flat(0.6));
    p.shape(disk(16, 18, 6.6), ["#5a6070", "#9aa2b4", "#d3d8e2"], sphere(16, 18, 6.6, 0.3), "#07080c");
    p.shape(disk(16, 18, 4.4), ["#0a1630", "#163a7a", "#2f74d0", "#8fc4ff"], sphere(16, 18, 4.4, 0.15));
    p.dot(14, 16, "#ffffff");
    p.dot(15, 16, "#d6ecff");
    p.dot(14, 17, "#d6ecff");
    p.shape(box(22, 12, 4, 2), ["#ffe9a8", "#ffffff"], flat(0.8));
  },

  "game-lab": (p) => {
    tile(p, ["#062a1d", "#0e4a33", "#177049", "#24a066"], "#021710");
    const cx = 16, cy = 16;
    const gear: Test = (x, y) => {
      const d = Math.hypot(x - cx, y - cy);
      const a = Math.atan2(y - cy, x - cx);
      const tooth = Math.cos(a * 8) > 0.35;
      return d <= 9.6 || (tooth && d <= 12.6);
    };
    p.shape(gear, ["#4a5462", "#7d8898", "#b6c0ce", "#eef2f6"], sphere(cx, cy, 12.6, 0.25), "#0b1110");
    p.shape(disk(cx, cy, 6.4), ["#7a0f12", "#c2232a", "#ef4a4a", "#ff8a7a"], sphere(cx, cy, 6.4, 0.3), "#2a0406");
    p.shape(poly([[14, 12.5], [14, 19.5], [20, 16]]), ["#e8e8e8", "#ffffff"], flat(1));
  },

  sweepstakes: (p) => {
    tile(p, ["#3a050c", "#6e0c18", "#a8172a", "#d9343f"], "#1f0206");
    p.shape(rbox(4, 6, 20, 22, 3), ["#8a5a08", "#d99a1a", "#ffd04a", "#fff2b0"], vert(6, 28), "#2a1802");
    p.shape(rbox(7, 3, 14, 5, 2), ["#c2232a", "#ef4a4a", "#ff9a8a"], vert(3, 8), "#2a0406");
    p.shape(box(6, 11, 16, 9), ["#d6dbe6", "#ffffff"], vert(11, 20), "#2a1802");
    for (const x of [7, 12, 17]) {
      p.shape(box(x, 12, 4, 7), ["#e9edf5", "#ffffff"], flat(0.9));
      p.glyph(SEVEN, x + 0.5 > x ? x : x, 13, "#c2232a");
    }
    p.shape(box(9, 22, 10, 3), ["#5a3a04", "#8a5a08"], flat(0.5));
    p.shape(box(25, 9, 2, 13), ["#7d8898", "#c3ccd8"], vert(9, 22), "#1f0206");
    p.shape(disk(26, 8, 2.6), ["#7a0f12", "#ef4a4a", "#ffb0a0"], sphere(26, 8, 2.6, 0.3), "#1f0206");
  },

  minigames: (p) => {
    tile(p, ["#061a3d", "#0c3270", "#1652a8", "#2a7ad8"], "#030d22");
    const cx = 16, cy = 17.5, r = 10.6;
    const colors: Ramp[] = [
      ["#a87a06", "#ffd04a", "#fff2b0"],
      ["#8a1018", "#e23a3a", "#ff8a7a"],
      ["#1a6a2a", "#3ccf5a", "#a8f0b0"],
      ["#b8bfcc", "#ffffff", "#ffffff"],
    ];
    for (let s = 0; s < 8; s++) {
      const a0 = (s / 8) * Math.PI * 2;
      const a1 = ((s + 1) / 8) * Math.PI * 2;
      const sector: Test = (x, y) => {
        let a = Math.atan2(y - cy, x - cx);
        if (a < 0) a += Math.PI * 2;
        return a >= a0 && a < a1 && Math.hypot(x - cx, y - cy) <= r;
      };
      p.shape(sector, colors[s % 4], sphere(cx, cy, r + 4, 0.35));
    }
    p.shape(ring(cx, cy, r - 0.2, r + 1.6), ["#8a5a08", "#d99a1a", "#ffd04a"], vert(5, 30), "#1a0f02");
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      p.dot(Math.round(cx + Math.cos(a) * (r + 0.7) - 0.5), Math.round(cy + Math.sin(a) * (r + 0.7) - 0.5), "#fff7d6");
    }
    p.shape(disk(cx, cy, 2.2), ["#8a5a08", "#ffd04a", "#ffffff"], sphere(cx, cy, 2.2, 0.4), "#1a0f02");
    p.shape(poly([[12.5, 2.5], [19.5, 2.5], [16, 8.5]]), ["#8a1018", "#e23a3a", "#ff8a7a"], vert(2, 9), "#2a0406");
  },

  citybuilder: (p) => {
    tile(p, ["#1c4a7a", "#2f6eb0", "#4f96d8", "#8cc4f2"], "#0c2440");
    p.shape(disk(25, 7, 2.8), ["#ffd04a", "#fff2b0", "#ffffff"], sphere(25, 7, 2.8, 0.5));
    const win = (x0: number, y0: number, w: number, h: number) => {
      for (let y = y0 + 2; y < y0 + h - 1; y += 3) for (let x = x0 + 1; x < x0 + w - 1; x += 2) p.dot(x, y, (x * 7 + y * 3) % 5 === 0 ? "#3a4058" : "#ffe27a");
    };
    p.shape(box(4, 13, 7, 13), ["#5a4a6a", "#7d6a8f", "#a08cb4"], (x) => 1 - (x - 4) / 7, "#141020");
    win(4, 13, 7, 13);
    p.shape(box(12, 7, 8, 19), ["#3a4a62", "#56708f", "#7d9abb"], (x) => 1 - (x - 12) / 8, "#0e1420");
    win(12, 7, 8, 19);
    p.shape(box(21, 15, 7, 11), ["#7a3a2a", "#a85a3f", "#cf8060"], (x) => 1 - (x - 21) / 7, "#200c06");
    win(21, 15, 7, 11);
    p.shape(and(box(2, 25, 28, 6), rbox(1, 1, 30, 30, 7)), ["#2a6a1a", "#46a02a", "#7ad24a"], vert(25, 28));
    p.shape(and(box(2, 28, 28, 4), rbox(2, 2, 28, 28, 6)), ["#4a2a12", "#6e4220"], vert(28, 31));
  },
};

export function projectIcon(id: string): PixelRect[] {
  const p = new Pix();
  (icons[id] ?? icons["game-lab"])(p);
  return p.rects();
}
