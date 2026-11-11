import type { PixelRect } from "@/lib/pixel-icons";

/** Renders a precomputed 32×32 project icon. */
export function ProjectIcon({ rects, size = 64, className }: { rects: PixelRect[]; size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} shapeRendering="crispEdges" aria-hidden="true" className={className}>
      {rects.map((r) => (
        <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.w} height={1} fill={r.c} />
      ))}
    </svg>
  );
}
