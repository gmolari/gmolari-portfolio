"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Glyph } from "./Glyph";

type Props = { name: string; sub: string; press: string; hint: string; loading: string; skip: string; skipHref: string };

/** Without input, the intro starts the page by itself after this long. */
const AUTO_START_MS = 3000;

/**
 * "PRESS START" intro. Server-rendered so there is no flash; the inline script in the layout adds
 * html.booted before paint when it was already seen this session or motion is reduced.
 */
export function BootScreen({ name, sub, press, hint, loading, skip, skipHref }: Props) {
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
    const onKey = (e: KeyboardEvent) => e.key !== "Tab" && start();
    const el = ref.current;
    el?.addEventListener("click", start);
    window.addEventListener("keydown", onKey);
    const timer = document.documentElement.classList.contains("booted") ? undefined : window.setTimeout(start, AUTO_START_MS);
    return () => {
      window.clearTimeout(timer);
      el?.removeEventListener("click", start);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  let i = 0;
  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={press}
      className="boot fixed inset-0 z-50 grid cursor-pointer place-items-center bg-[linear-gradient(#0b1a19,#050c0b)] p-6 text-center text-[#e6f2ee]"
    >
      <div className="absolute inset-0 bg-[conic-gradient(rgb(255_255_255/0.03)_25%,transparent_0_50%,rgb(255_255_255/0.03)_0_75%,transparent_0)] bg-size-[4px_4px]" />
      <div className="relative">
        <h2 aria-label={name} className="m-0 font-pixel text-[clamp(38px,8vw,80px)] leading-none font-bold text-[#f0b841] [text-shadow:0_4px_0_#8a4f0b,0_8px_0_#2a1608]">
          {name.split(" ").map((word, w) => (
            <span key={w} className="block">
              {[...word].map((ch) => (
                <span key={i} aria-hidden="true" style={{ animationDelay: `${i++ * 50}ms` }}>
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </h2>
        <p className="mt-6 mb-12 font-pixel text-[clamp(12px,2vw,16px)] tracking-[0.14em] text-[#8fb3ab]">{sub}</p>
        <div className="animate-blink font-pixel text-[clamp(20px,3vw,26px)] tracking-[0.1em] [animation-delay:1.2s]">▶ {press}</div>
        <div className="mt-2.5 text-[13px] text-[#8fb3ab]">{hint}</div>
        <div className="mx-auto mt-9 w-[min(320px,80vw)]" role="progressbar" aria-label={loading} aria-valuemin={0} aria-valuemax={100}>
          <div className="mb-1.5 flex justify-between font-pixel text-[12px] tracking-[0.14em] text-[#8fb3ab]">
            <span>{loading}</span>
            <span className="animate-blink">...</span>
          </div>
          <div className="h-4 overflow-hidden rounded-[3px] border-2 border-[#9fd6ca] bg-[#050c0b] p-[2px] shadow-[0_0_0_2px_#050c0b]">
            <div
              className="boot-progress h-full bg-[#f0b841]"
              style={{
                animationDuration: `${AUTO_START_MS}ms`,
                backgroundImage:
                  "linear-gradient(rgb(255 255 255 / 0.45) 0 25%, transparent 25% 70%, rgb(0 0 0 / 0.25) 70%), repeating-linear-gradient(90deg, transparent 0 10px, rgb(0 0 0 / 0.25) 10px 12px)",
              }}
            />
          </div>
        </div>
      </div>
      <Link href={skipHref} className="btn-pixel absolute right-4 bottom-4" onClick={(e) => e.stopPropagation()}>
        {skip} <Glyph name="forward" size={14} />
      </Link>
    </div>
  );
}
