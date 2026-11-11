"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { PixelArt } from "./PixelArt";

type Props = { name: string; sub: string; press: string; hint: string; skip: string; skipHref: string };

/**
 * "PRESS START" intro. Rendered on the server so there is no flash; an inline script in the layout
 * adds html.booted before paint when the visitor already saw it this session (or prefers reduced motion).
 */
export function BootScreen({ name, sub, press, hint, skip, skipHref }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const start = () => {
      if (done.current || document.documentElement.classList.contains("booted")) return;
      done.current = true;
      ref.current?.classList.add("out");
      try {
        sessionStorage.setItem("booted", "1");
      } catch {}
      window.setTimeout(() => document.documentElement.classList.add("booted"), 600);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") return; // let keyboard users reach the skip link
      start();
    };
    const el = ref.current;
    el?.addEventListener("click", start);
    window.addEventListener("keydown", onKey);
    return () => {
      el?.removeEventListener("click", start);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  let i = 0;
  return (
    <div ref={ref} className="boot" role="dialog" aria-label={press}>
      <div>
        <PixelArt name="avatar" scale={5} className="boot-avatar" />
        <h2 aria-label={name}>
          {name.split(" ").map((word, w) => (
            <span key={w} style={{ display: "block", animation: "none" }}>
              {[...word].map((ch) => (
                <span key={i} aria-hidden="true" style={{ animationDelay: `${i++ * 50}ms` }}>
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </h2>
        <p className="boot-sub">{sub}</p>
        <div className="press">{press}</div>
        <div className="press-hint">{hint}</div>
      </div>
      <Link href={skipHref} className="chip-btn boot-skip" onClick={(e) => e.stopPropagation()}>
        {skip} ▸▸
      </Link>
    </div>
  );
}
