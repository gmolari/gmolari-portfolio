"use client";

import { useState } from "react";
import { PixelArt } from "./PixelArt";
import type { Rarity, SpriteName } from "@/content/profile";

export type InventoryItem = {
  id: string;
  name: string;
  sprite: SpriteName;
  rarity: Rarity;
  rarityLabel: string;
  context: string;
  role: string;
  summary: string;
  how: string;
  purpose: string;
  stack: string[];
  link?: string;
};

type Labels = { howItWorks: string; purpose: string; stack: string; role: string; source: string };

export function Inventory({ items, labels }: { items: InventoryItem[]; labels: Labels }) {
  const [selected, setSelected] = useState(items[0].id);
  const item = items.find((i) => i.id === selected) ?? items[0];

  return (
    <>
      <div className="inv" role="group">
        {items.map((it, d) => (
          <button
            key={it.id}
            type="button"
            className={`item r-${it.rarity}`}
            style={{ "--d": d } as React.CSSProperties}
            aria-pressed={it.id === selected}
            aria-controls="inspector"
            onClick={() => setSelected(it.id)}
            title={it.name}
          >
            <PixelArt name={it.sprite} scale={3} />
            <span className="sr-only">{it.name}</span>
          </button>
        ))}
      </div>

      <article id="inspector" key={item.id} className={`inspector r-${item.rarity}`} aria-live="polite">
        <header>
          <PixelArt name={item.sprite} scale={3} />
          <div>
            <div className="rar">{item.rarityLabel}</div>
            <h3>{item.name}</h3>
            <div className="ctx">
              {item.context} · {item.role}
            </div>
          </div>
        </header>
        <p>{item.summary}</p>
        <h4>{labels.howItWorks}</h4>
        <p>{item.how}</p>
        <h4>{labels.purpose}</h4>
        <p>{item.purpose}</p>
        <h4>{labels.stack}</h4>
        <div className="tags">
          {item.stack.map((s) => (
            <span key={s} className="tag">
              {s}
            </span>
          ))}
        </div>
        {item.link && (
          <p style={{ marginTop: 14 }}>
            <a className="chip-btn" href={item.link} target="_blank" rel="noopener noreferrer">
              {labels.source} ↗
            </a>
          </p>
        )}
      </article>
    </>
  );
}
