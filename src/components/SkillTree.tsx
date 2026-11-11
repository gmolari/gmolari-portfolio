"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { IconData } from "@/lib/skill-icons";
import type { StackItem } from "@/lib/stack-icons";
import { TechChip, TechIcon } from "./TechIcon";
import { Glyph } from "./Glyph";

export type TreeNode = {
  id: string;
  label: string;
  icon: IconData;
  x: number;
  y: number;
  level: number;
  category: string;
  note: string;
  usedIn: { id: string; name: string }[];
  extras: StackItem[];
};

type Labels = {
  usedIn: string;
  alsoWith: string;
  level: string;
  rank: string;
  controls: { zoomIn: string; zoomOut: string; reset: string; help: string };
};

const noop = () => () => {};

export function inspectProject(id: string) {
  window.dispatchEvent(new CustomEvent("inspect-project", { detail: id }));
}

/* ---------- world geometry ---------- */
type Dims = { w: number; h: number };
const LANDSCAPE: Dims = { w: 1000, h: 680 };
const PORTRAIT: Dims = { w: 600, h: 940 };
/** Node centre in world px; leaves room for the rune (±48px) and its label + pips below (~60px). */
const toWorld = (n: { x: number; y: number }, d: Dims) => ({ x: 64 + (n.x / 100) * (d.w - 128), y: 64 + (n.y / 100) * (d.h - 150) });

/** Irregular stone outline, deterministic per skill id. */
function runeShape(id: string) {
  let s = [...id].reduce((a, c) => a * 31 + c.charCodeAt(0), 7) % 2147483647;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const pts: string[] = [];
  const inner: string[] = [];
  const count = 9;
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 - Math.PI / 2 + (rnd() - 0.5) * 0.22;
    const r = 36 + (rnd() - 0.5) * 7;
    pts.push(`${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`);
    inner.push(`${(Math.cos(a) * r * 0.8).toFixed(1)},${(Math.sin(a) * r * 0.8).toFixed(1)}`);
  }
  const marks = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 + rnd() * 0.4;
    const r0 = 22.5;
    const r1 = 27 + rnd() * 2;
    return { x1: Math.cos(a) * r0, y1: Math.sin(a) * r0, x2: Math.cos(a) * r1, y2: Math.sin(a) * r1 };
  });
  return { outer: pts.join(" "), inner: inner.join(" "), marks };
}

/* ---------- view (pan/zoom) ---------- */
type View = { x: number; y: number; k: number };
const MIN_K = 0.35;
const MAX_K = 2.2;
const clampK = (k: number) => Math.min(MAX_K, Math.max(MIN_K, k));

function fit(vw: number, vh: number, d: Dims): View {
  const k = clampK(Math.min(vw / d.w, (vh - 34) / d.h) * 0.98);
  return { k, x: (vw - d.w * k) / 2, y: 34 + (vh - 34 - d.h * k) / 2 };
}

const RUNE_PATTERN = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240' fill='none' stroke='#9fd6ca' stroke-opacity='0.09' stroke-width='2'><circle cx='60' cy='60' r='26'/><path d='M60 34v52M42 48l36 24M78 48L42 72'/><path d='M180 150l14 24h-28z'/><circle cx='180' cy='166' r='34' stroke-dasharray='4 6'/><path d='M150 40h20M160 30v20M30 190l10 10 10-10-10-10z'/><circle cx='118' cy='118' r='2' fill='#9fd6ca' fill-opacity='0.25'/><circle cx='210' cy='70' r='1.5' fill='#9fd6ca' fill-opacity='0.3'/><circle cx='20' cy='120' r='1.5' fill='#9fd6ca' fill-opacity='0.3'/></svg>`,
)}")`;

export function SkillTree({ nodes, links, labels }: { nodes: TreeNode[]; links: [string, string][]; labels: Labels }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [view, setView] = useState<View>({ x: 0, y: 0, k: 0.7 });
  const [ready, setReady] = useState(false);
  const [dims, setDims] = useState<Dims>(LANDSCAPE);
  const [tipPos, setTipPos] = useState<{ left: number; top: number } | null>(null);
  const mounted = useSyncExternalStore(noop, () => true, () => false);

  const vpRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const leaveTimer = useRef<number | undefined>(undefined);
  const touched = useRef(false); // user moved the camera, stop auto-fitting
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const drag = useRef<{ moved: boolean; last?: { x: number; y: number }; pinch?: number }>({ moved: false });

  const activeId = hovered ?? pinned;
  const active = nodes.find((n) => n.id === activeId) ?? null;
  const neighbours = useMemo(
    () => new Set(activeId ? links.flatMap(([a, b]) => (a === activeId ? [b] : b === activeId ? [a] : [])) : []),
    [activeId, links],
  );
  const world = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, toWorld(n, dims)])), [nodes, dims]);
  const shapes = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, runeShape(n.id)])), [nodes]);

  const enter = useCallback((id: string) => {
    if (pointers.current.size) return; // no tooltips while dragging
    window.clearTimeout(leaveTimer.current);
    setHovered(id);
  }, []);
  const leave = useCallback(() => {
    window.clearTimeout(leaveTimer.current);
    leaveTimer.current = window.setTimeout(() => setHovered(null), 180);
  }, []);

  /* fit on mount and on resize until the user moves the camera */
  useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return;
    const ro = new ResizeObserver(() => {
      const d = vp.clientWidth / vp.clientHeight < 0.9 ? PORTRAIT : LANDSCAPE;
      setDims(d);
      if (!touched.current) setView(fit(vp.clientWidth, vp.clientHeight, d));
      setReady(true);
    });
    ro.observe(vp);
    return () => ro.disconnect();
  }, []);

  /* wheel zoom around the cursor (non-passive so the page doesn't scroll) */
  useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      touched.current = true;
      const r = vp.getBoundingClientRect();
      const px = e.clientX - r.left;
      const py = e.clientY - r.top;
      setView((v) => {
        const k = clampK(v.k * Math.exp(-e.deltaY * 0.0015));
        return { k, x: px - (px - v.x) * (k / v.k), y: py - (py - v.y) * (k / v.k) };
      });
    };
    vp.addEventListener("wheel", onWheel, { passive: false });
    return () => vp.removeEventListener("wheel", onWheel);
  }, []);

  /* release pin on outside click / Escape */
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!vpRef.current?.contains(t) && !tipRef.current?.contains(t)) setPinned(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && (setPinned(null), setHovered(null));
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  /* pan + pinch */
  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-control]")) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    drag.current = { moved: false, last: { x: e.clientX, y: e.clientY } };
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      drag.current.pinch = Math.hypot(a.x - b.x, a.y - b.y);
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const vp = vpRef.current!;
    if (pointers.current.size === 2 && drag.current.pinch) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const r = vp.getBoundingClientRect();
      const mx = (a.x + b.x) / 2 - r.left;
      const my = (a.y + b.y) / 2 - r.top;
      const ratio = d / drag.current.pinch;
      drag.current.pinch = d;
      drag.current.moved = true;
      touched.current = true;
      setView((v) => {
        const k = clampK(v.k * ratio);
        return { k, x: mx - (mx - v.x) * (k / v.k), y: my - (my - v.y) * (k / v.k) };
      });
      return;
    }
    const last = drag.current.last!;
    const dx = e.clientX - last.x;
    const dy = e.clientY - last.y;
    if (!drag.current.moved && Math.hypot(dx, dy) < 4) return;
    if (!drag.current.moved) {
      drag.current.moved = true;
      vp.setPointerCapture(e.pointerId);
      setHovered(null);
    }
    touched.current = true;
    drag.current.last = { x: e.clientX, y: e.clientY };
    setView((v) => ({ ...v, x: v.x + dx, y: v.y + dy }));
  };
  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) drag.current.pinch = undefined;
  };

  const zoomBy = (f: number) => {
    const vp = vpRef.current!;
    touched.current = true;
    const px = vp.clientWidth / 2;
    const py = vp.clientHeight / 2;
    setView((v) => {
      const k = clampK(v.k * f);
      return { k, x: px - (px - v.x) * (k / v.k), y: py - (py - v.y) * (k / v.k) };
    });
  };
  const reset = () => {
    const vp = vpRef.current!;
    touched.current = false;
    setView(fit(vp.clientWidth, vp.clientHeight, dims));
  };

  /* tooltip placement (fixed, in a portal): beside the rune, flipped and clamped to the window */
  useLayoutEffect(() => {
    const tip = tipRef.current;
    const rune = activeId ? vpRef.current?.querySelector<HTMLElement>(`[data-skill="${activeId}"] svg`) : null;
    if (!tip || !rune) return setTipPos(null);
    const o = rune.getBoundingClientRect();
    const tw = tip.offsetWidth;
    const th = tip.offsetHeight;
    const gap = 14;
    const m = 10;
    let left = o.right + gap;
    if (left + tw > innerWidth - m) left = o.left - gap - tw;
    if (left < m) left = Math.min(Math.max(m, o.left + o.width / 2 - tw / 2), innerWidth - tw - m);
    let top = o.top + o.height / 2 - th / 2;
    if (left === Math.min(Math.max(m, o.left + o.width / 2 - tw / 2), innerWidth - tw - m) && (o.left - gap - tw < m)) top = o.bottom + gap;
    top = Math.min(Math.max(m, top), innerHeight - th - m);
    setTipPos({ left, top });
  }, [activeId, view]);

  const bgSize = (n: number) => `${n * view.k}px ${n * view.k}px`;

  return (
    <div className="relative">
      <div
        ref={vpRef}
        className="relative h-[clamp(520px,110vw,560px)] cursor-grab sm:h-[clamp(420px,60vw,520px)] touch-none overflow-hidden rounded-lg border-2 border-edge bg-slot shadow-[inset_0_0_0_2px_var(--frame-in),inset_0_0_60px_rgb(0_0_0/0.45)] select-none active:cursor-grabbing"
        style={{
          backgroundImage: `${RUNE_PATTERN}, radial-gradient(circle, var(--gridline) 1.5px, transparent 1.6px), linear-gradient(var(--gridline) 1px, transparent 1px), linear-gradient(90deg, var(--gridline) 1px, transparent 1px)`,
          backgroundSize: `${bgSize(240)}, ${bgSize(32)}, ${bgSize(128)}, ${bgSize(128)}`,
          backgroundPosition: `${view.x}px ${view.y}px`,
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* vignette */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgb(0_0_0/0.35))]" />

        <div
          className={`absolute top-0 left-0 origin-top-left transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
          style={{ width: dims.w, height: dims.h, transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})` }}
        >
          <svg className="st-links absolute inset-0 overflow-visible" width={dims.w} height={dims.h} aria-hidden="true">
            <defs>
              <linearGradient id="rune-stone" x1="0" y1="0" x2="0.4" y2="1">
                <stop offset="0" stopColor="#4a5a63" />
                <stop offset="0.55" stopColor="#2b373e" />
                <stop offset="1" stopColor="#182126" />
              </linearGradient>
              <radialGradient id="rune-inlay" cx="0.38" cy="0.32" r="0.75">
                <stop offset="0" stopColor="#ffffff" />
                <stop offset="0.6" stopColor="#e3eeea" />
                <stop offset="1" stopColor="#a9c6bf" />
              </radialGradient>
            </defs>
            {links.map(([a, b]) => (
              <line
                key={a + b}
                className={activeId && (a === activeId || b === activeId) ? "lit" : undefined}
                x1={world[a].x}
                y1={world[a].y}
                x2={world[b].x}
                y2={world[b].y}
              />
            ))}
          </svg>

          {nodes.map((n, d) => {
            const p = world[n.id];
            const sh = shapes[n.id];
            const state = n.id === activeId ? " on" : activeId && !neighbours.has(n.id) ? " dim" : "";
            return (
              <button
                key={n.id}
                type="button"
                data-skill={n.id}
                className={`rune${n.level === 5 ? " max" : ""}${state} absolute flex -translate-x-1/2 -translate-y-[48px] animate-pop cursor-pointer flex-col items-center gap-1 border-0 bg-transparent p-0 text-ink`}
                style={{ left: p.x, top: p.y, "--brand": n.icon.hex, animationDelay: `${500 + d * 60}ms` } as React.CSSProperties}
                aria-pressed={pinned === n.id}
                aria-describedby={n.id === activeId ? "skill-tip" : undefined}
                aria-label={`${n.label}, ${labels.rank} ${n.level}/5`}
                onMouseEnter={() => enter(n.id)}
                onMouseLeave={leave}
                onFocus={() => enter(n.id)}
                onBlur={leave}
                onClick={() => {
                  if (drag.current.moved) return;
                  setPinned((cur) => (cur === n.id ? null : n.id));
                }}
              >
                <span className="relative block size-[96px]">
                  <svg viewBox="-48 -48 96 96" className="rune-stone absolute inset-0 size-full overflow-visible">
                    <circle className="rune-ring" r="44" fill="none" strokeWidth="2.5" strokeDasharray="6 7" />
                    <polygon points={sh.outer} fill="url(#rune-stone)" className="rune-edge" strokeWidth="3" strokeLinejoin="round" />
                    <polygon points={sh.inner} fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth="1.5" strokeLinejoin="round" />
                    {sh.marks.map((m, i) => (
                      <line key={i} className="rune-mark" x1={m.x1} y1={m.y1} x2={m.x2} y2={m.y2} strokeWidth="2.5" strokeLinecap="round" />
                    ))}
                    <circle r="17" fill="url(#rune-inlay)" stroke="#0b1110" strokeWidth="2" />
                  </svg>
                  <span className="absolute inset-0 grid place-items-center">
                    <TechIcon icon={n.icon} name={n.label} size={22} />
                  </span>
                  <span className="spark s1" aria-hidden="true" />
                  <span className="spark s2" aria-hidden="true" />
                  <span className="spark s3" aria-hidden="true" />
                  <span className="spark s4" aria-hidden="true" />
                </span>
                <span className="rounded-md bg-frame-in/70 px-1.5 py-px font-pixel text-[14px] leading-tight whitespace-nowrap text-[#e6f2ee]">{n.label}</span>
                <span className="flex gap-[3px]">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <i key={i} className={`block size-[7px] rotate-45 border border-frame-in ${i <= n.level ? "bg-accent" : "bg-slot"}`} />
                  ))}
                </span>
              </button>
            );
          })}
        </div>

        {/* camera controls */}
        <div data-control className="absolute right-2.5 bottom-2.5 z-20 flex flex-col gap-1.5">
          <button type="button" className="btn-pixel size-9 px-0 text-lg" onClick={() => zoomBy(1.25)} aria-label={labels.controls.zoomIn} title={labels.controls.zoomIn}>
            +
          </button>
          <button type="button" className="btn-pixel size-9 px-0 text-lg" onClick={() => zoomBy(0.8)} aria-label={labels.controls.zoomOut} title={labels.controls.zoomOut}>
            −
          </button>
          <button type="button" className="btn-pixel size-9 px-0" onClick={reset} aria-label={labels.controls.reset} title={labels.controls.reset}>
            <Glyph name="target" size={14} />
          </button>
        </div>
        <div className="pointer-events-none absolute top-2.5 left-3 z-20 flex max-w-[calc(100%-90px)] items-center gap-1.5 rounded-md bg-frame-in/70 px-2 py-1 text-[11.5px] leading-tight text-[#cfe3de]">
          <Glyph name="pad" size={12} /> {labels.controls.help}
        </div>
        <div className="pointer-events-none absolute top-2.5 right-3 z-20 rounded-md bg-frame-in/70 px-2 py-0.5 font-pixel text-[12px] text-[#cfe3de] tabular-nums">
          {Math.round(view.k * 100)}%
        </div>
      </div>

      {mounted &&
        active &&
        createPortal(
          <div
            ref={tipRef}
            id="skill-tip"
            role="tooltip"
            key={active.id}
            className="fixed z-[200] w-[min(340px,calc(100vw-20px))] animate-inspect rounded-lg border-3 border-(--brand) bg-linear-to-b from-panel to-panel-2 p-4 text-ink shadow-[0_0_0_2px_var(--frame-in),0_10px_0_var(--shadow),0_0_40px_color-mix(in_srgb,var(--brand)_35%,transparent)]"
            style={{ "--brand": active.icon.hex, ...(tipPos ? { left: tipPos.left, top: tipPos.top } : { left: -9999, top: 0 }) } as React.CSSProperties}
            onMouseEnter={() => window.clearTimeout(leaveTimer.current)}
            onMouseLeave={leave}
          >
            <header className="flex items-center gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-lg border-2 border-(--brand) bg-[radial-gradient(circle_at_35%_30%,#fff,#dfece8_60%,#a9c6bf)] shadow-[0_0_0_2px_var(--frame-in)]">
                <TechIcon icon={active.icon} name={active.label} size={28} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="m-0 font-pixel text-[22px] leading-tight">{active.label}</h3>
                <div className="text-[12px] text-muted">
                  {active.category} · {labels.rank} {active.level}/5
                </div>
              </div>
              <span className="rounded-md border-2 border-[#fff3c4] bg-linear-to-b from-[#ffe7a3] to-accent px-2 py-0.5 font-pixel text-[13px] text-[#3a2400]">
                {active.level === 5 ? "MAX" : `LV ${active.level}`}
              </span>
            </header>
            <div className="mt-3 flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <i key={i} className={`block h-2 flex-1 rounded-[2px] border border-frame-in ${i <= active.level ? "bar-gloss bg-accent" : "bg-slot"}`} />
              ))}
            </div>
            <p className="mt-3 mb-0 border-l-3 border-(--brand) pl-3 text-[14px] leading-relaxed italic">{active.note}</p>
            {active.usedIn.length > 0 && (
              <>
                <h4 className="mt-3.5 mb-1.5 flex items-center gap-1.5 font-pixel text-[13px] tracking-wider text-accent uppercase">
                  <Glyph name="bag" size={12} /> {labels.usedIn}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {active.usedIn.map((pr) => (
                    <button
                      key={pr.id}
                      type="button"
                      onClick={() => inspectProject(pr.id)}
                      className="cursor-pointer rounded-md border-2 border-edge bg-slot px-2 py-0.5 font-pixel text-[13px] text-ink transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                    >
                      {pr.name} ▸
                    </button>
                  ))}
                </div>
              </>
            )}
            {active.extras.length > 0 && (
              <>
                <h4 className="mt-3.5 mb-1.5 flex items-center gap-1.5 font-pixel text-[13px] tracking-wider text-accent uppercase">
                  <Glyph name="link" size={12} /> {labels.alsoWith}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {active.extras.map((e) => (
                    <TechChip key={e.name} icon={e.icon} name={e.name} />
                  ))}
                </div>
              </>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}
