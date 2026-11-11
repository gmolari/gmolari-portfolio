/**
 * Fixed scenery behind the page: twinkling pixel stars (dark), drifting pixel clouds (light),
 * a faint pixel grid and two layers of stepped hills along the bottom.
 */
let seed = 11;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

const stars = Array.from({ length: 70 }, () => ({
  left: `${(rnd() * 100).toFixed(2)}%`,
  top: `${(rnd() * 70).toFixed(2)}%`,
  t: `${(2 + rnd() * 4).toFixed(1)}s`,
  dl: `${(-rnd() * 5).toFixed(1)}s`,
  big: rnd() > 0.85,
}));

const clouds = [
  { top: "8%", dur: "95s", delay: "-10s", scale: 4 },
  { top: "22%", dur: "130s", delay: "-70s", scale: 3 },
  { top: "40%", dur: "110s", delay: "-40s", scale: 5 },
  { top: "62%", dur: "150s", delay: "-110s", scale: 3 },
];

const CLOUD = ["....####......", "..########....", ".############.", "##############", ".############."];

/** Stepped hill silhouette: a polyline on an integer grid so it reads as pixels. */
function hills(step: number, base: number, amp: number, phase: number) {
  const pts: string[] = [];
  let prev = base;
  for (let x = 0; x <= 400; x += step) {
    const y = Math.round(base - amp * (0.5 + 0.5 * Math.sin(x / 37 + phase) * Math.cos(x / 91 + phase * 2)));
    pts.push(`${x},${prev} ${x},${y}`);
    prev = y;
  }
  return `0,100 ${pts.join(" ")} 400,${prev} 400,100`;
}

export function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden no-print">
      <div className="absolute inset-0 bg-pixelgrid opacity-60" />
      <div className="stars absolute inset-0">
        {stars.map((s, i) => (
          <i
            key={i}
            style={{ left: s.left, top: s.top, ["--t" as string]: s.t, ["--dl" as string]: s.dl, ...(s.big ? { width: 3, height: 3 } : {}) }}
          />
        ))}
      </div>
      <div className="clouds absolute inset-0">
        {clouds.map((c, i) => (
          <svg
            key={i}
            className="cloud"
            style={{ top: c.top, animationDuration: c.dur, animationDelay: c.delay }}
            width={14 * c.scale}
            height={5 * c.scale}
            viewBox="0 0 14 5"
            shapeRendering="crispEdges"
          >
            {CLOUD.flatMap((r, y) => [...r].map((ch, x) => (ch === "#" ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#ffffff" opacity={0.85} /> : null)))}
          </svg>
        ))}
      </div>
      <svg className="absolute inset-x-0 bottom-0 h-[22vh] w-full" viewBox="0 0 400 100" preserveAspectRatio="none" shapeRendering="crispEdges">
        <polygon points={hills(8, 62, 34, 0.4)} fill="var(--hill-far)" />
        <polygon points={hills(6, 84, 22, 2.1)} fill="var(--hill-near)" />
      </svg>
    </div>
  );
}
