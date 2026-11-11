"use client";

import { moon, sun } from "@/lib/theme-glyphs";

/** Swaps data-theme on <html> with a stepped circular reveal that starts at the click point. */
export function ThemeToggle({ label }: { label: string }) {
  function onClick(e: React.MouseEvent<HTMLButtonElement>) {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    const apply = () => {
      root.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch {}
    };
    if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return apply();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || rect.left + rect.width / 2;
    const y = e.clientY || rect.top + rect.height / 2;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(apply).ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 700, easing: "steps(16, end)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  }

  return (
    <button type="button" className="btn-pixel w-[42px] px-0" onClick={onClick} aria-label={label} title={label}>
      <svg className="theme-ico" viewBox="0 0 12 12" width={20} height={20} shapeRendering="crispEdges" aria-hidden="true">
        <g className="sun" fill="currentColor">
          {sun.map((r) => (
            <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.w} height={1} />
          ))}
        </g>
        <g className="moon" fill="currentColor">
          {moon.map((r) => (
            <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.w} height={1} />
          ))}
        </g>
      </svg>
    </button>
  );
}
