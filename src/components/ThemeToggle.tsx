"use client";

type Props = { label: string };

/** Swaps data-theme on <html> with a stepped circular reveal that starts at the click point. */
export function ThemeToggle({ label }: Props) {
  function onClick(e: React.MouseEvent<HTMLButtonElement>) {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    const apply = () => {
      root.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch {}
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduce) return apply();

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
    <button type="button" className="chip-btn" onClick={onClick} aria-label={label} title={label}>
      <svg className="theme-ico" viewBox="0 0 9 9" shapeRendering="crispEdges" aria-hidden="true">
        <g className="sun" fill="currentColor">
          <rect x="3" y="2" width="3" height="5" />
          <rect x="2" y="3" width="5" height="3" />
          <rect x="4" y="0" width="1" height="1" />
          <rect x="4" y="8" width="1" height="1" />
          <rect x="0" y="4" width="1" height="1" />
          <rect x="8" y="4" width="1" height="1" />
          <rect x="1" y="1" width="1" height="1" />
          <rect x="7" y="1" width="1" height="1" />
          <rect x="1" y="7" width="1" height="1" />
          <rect x="7" y="7" width="1" height="1" />
        </g>
        <g className="moon" fill="currentColor">
          <rect x="3" y="1" width="3" height="1" />
          <rect x="2" y="2" width="2" height="1" />
          <rect x="1" y="3" width="2" height="3" />
          <rect x="2" y="6" width="2" height="1" />
          <rect x="3" y="7" width="4" height="1" />
          <rect x="6" y="6" width="2" height="1" />
        </g>
      </svg>
    </button>
  );
}
