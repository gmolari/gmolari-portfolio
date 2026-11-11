import type { IconData } from "@/lib/skill-icons";

/** Brand icon for a technology; falls back to a pixel badge with the initial. */
export function TechIcon({ icon, name, size = 16 }: { icon: IconData | null; name: string; size?: number }) {
  if (!icon)
    return (
      <span
        aria-hidden="true"
        className="inline-grid shrink-0 place-items-center rounded-[3px] bg-edge font-pixel leading-none text-ink"
        style={{ width: size, height: size, fontSize: size * 0.7 }}
      >
        {name[0]}
      </span>
    );
  if (icon.kind === "path")
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className="shrink-0">
        <path d={icon.path} fill={icon.hex} />
      </svg>
    );
  const w = icon.rows[0].length;
  return (
    <svg viewBox={`-1 -1 ${w + 2} ${icon.rows.length + 2}`} width={size} height={size} shapeRendering="crispEdges" aria-hidden="true" className="shrink-0">
      {icon.rows.flatMap((r, y) => [...r].map((c, x) => (c === "#" ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={icon.hex} /> : null)))}
    </svg>
  );
}

/** Same icon, sitting on a light chip so dark brand colours (Next.js, Expo…) stay visible in dark mode. */
export function TechChip({ icon, name }: { icon: IconData | null; name: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-edge bg-panel-2 py-0.5 pr-2.5 pl-1 text-[12.5px] transition-colors hover:border-accent">
      <span className="grid size-5 place-items-center rounded-full bg-[#eef5f3]">
        <TechIcon icon={icon} name={name} size={13} />
      </span>
      {name}
    </span>
  );
}
