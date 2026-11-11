"use client";

import { useEffect, useRef, useState } from "react";
import type { Rarity } from "@/content/profile";
import type { PixelRect } from "@/lib/pixel-icons";
import type { StackItem } from "@/lib/stack-icons";
import { ProjectIcon } from "./ProjectIcon";
import { TechChip } from "./TechIcon";
import { Glyph } from "./Glyph";

export type InventoryItem = {
  id: string;
  name: string;
  icon: PixelRect[];
  rarity: Rarity;
  rarityLabel: string;
  context: string;
  role: string;
  summary: string;
  how: string;
  purpose: string;
  stack: StackItem[];
  link?: string;
};

type Labels = { howItWorks: string; purpose: string; stack: string; source: string; rarities: Record<Rarity, string> };

const RARITIES: Rarity[] = ["legendary", "epic", "rare", "uncommon"];

export function Inventory({ items, labels }: { items: InventoryItem[]; labels: Labels }) {
  const [selected, setSelected] = useState(items[0].id);
  const rootRef = useRef<HTMLDivElement>(null);
  const item = items.find((i) => i.id === selected) ?? items[0];

  // Skill tree chips ask the inventory to show a project.
  useEffect(() => {
    const onInspect = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (!items.some((i) => i.id === id)) return;
      setSelected(id);
      rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener("inspect-project", onInspect);
    return () => window.removeEventListener("inspect-project", onInspect);
  }, [items]);

  return (
    <div ref={rootRef} className="grid scroll-mt-24 gap-5 @[720px]:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
      <div>
        <div className="grid grid-cols-3 gap-2.5" role="group">
          {items.map((it, d) => {
            const on = it.id === selected;
            return (
              <button
                key={it.id}
                type="button"
                title={it.name}
                aria-pressed={on}
                aria-controls="inspector"
                onClick={() => setSelected(it.id)}
                style={{ animationDelay: `${800 + d * 60}ms` }}
                className={`r-${it.rarity} group relative grid aspect-square animate-pop cursor-pointer place-items-center overflow-hidden rounded-lg border-3 border-(--rc) bg-slot bg-pixelgrid p-0 shadow-[inset_0_0_0_2px_var(--frame-in)] transition duration-200 ease-[cubic-bezier(.3,1.6,.5,1)] hover:-translate-y-1.5 hover:-rotate-3 ${
                  on ? "shadow-[inset_0_0_0_2px_var(--frame-in),0_0_0_3px_var(--rc),0_0_22px_color-mix(in_srgb,var(--rc)_55%,transparent)]" : ""
                }`}
              >
                <ProjectIcon rects={it.icon} size={64} className="h-auto w-[78%] transition-transform duration-200 group-hover:scale-110" />
                <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/25 opacity-0 group-hover:animate-shine group-hover:opacity-100" />
                <span className="sr-only">{it.name}</span>
              </button>
            );
          })}
        </div>
        <ul className="mt-3 flex list-none flex-wrap gap-x-3 gap-y-1 p-0 text-[11.5px] text-muted">
          {RARITIES.map((r) => (
            <li key={r} className={`r-${r} flex items-center gap-1.5`}>
              <i className="block size-2.5 rounded-[2px] border border-frame-in bg-(--rc)" />
              {labels.rarities[r]}
            </li>
          ))}
        </ul>
      </div>

      <article
        id="inspector"
        key={item.id}
        aria-live="polite"
        className={`r-${item.rarity} relative min-w-0 animate-inspect rounded-lg border-3 border-(--rc) bg-slot p-4 sm:p-5`}
      >
        <header className="mb-3 flex items-center gap-4">
          <span className="grid shrink-0 place-items-center rounded-xl border-3 border-(--rc) bg-panel-2 bg-pixelgrid p-1.5 shadow-[0_0_0_2px_var(--frame-in)]">
            <ProjectIcon rects={item.icon} size={72} className="animate-float" />
          </span>
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1 rounded-full border-2 border-(--rc) px-2 py-px font-pixel text-[11px] tracking-[0.12em] text-(--rc) uppercase">
              <Glyph name="star" size={10} /> {item.rarityLabel}
            </span>
            <h3 className="mt-1 mb-0.5 font-pixel text-2xl leading-tight @sm:text-[28px]">{item.name}</h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[13px] text-muted">
              <span className="inline-flex items-center gap-1">
                <Glyph name="flag" size={11} /> {item.context}
              </span>
              <span className="inline-flex items-center gap-1">
                <Glyph name="sword" size={11} /> {item.role}
              </span>
            </div>
          </div>
        </header>

        <p className="m-0 text-[15px] font-medium">{item.summary}</p>

        <div className="mt-4 grid gap-4 @[900px]:grid-cols-2">
          <section>
            <h4 className="mb-1 flex items-center gap-1.5 font-pixel text-[13px] tracking-wider text-accent uppercase">
              <Glyph name="bolt" size={12} /> {labels.howItWorks}
            </h4>
            <p className="m-0 text-[14.5px] text-muted">{item.how}</p>
          </section>
          <section>
            <h4 className="mb-1 flex items-center gap-1.5 font-pixel text-[13px] tracking-wider text-accent uppercase">
              <Glyph name="target" size={12} /> {labels.purpose}
            </h4>
            <p className="m-0 text-[14.5px] text-muted">{item.purpose}</p>
          </section>
        </div>

        <h4 className="mt-4 mb-1.5 flex items-center gap-1.5 font-pixel text-[13px] tracking-wider text-accent uppercase">
          <Glyph name="link" size={12} /> {labels.stack}
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {item.stack.map((s) => (
            <TechChip key={s.name} icon={s.icon} name={s.name} />
          ))}
        </div>

        {item.link && (
          <a className="btn-pixel mt-4" href={item.link} target="_blank" rel="noopener noreferrer">
            <Glyph name="external" size={12} /> {labels.source}
          </a>
        )}
      </article>
    </div>
  );
}
