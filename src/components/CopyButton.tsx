"use client";

import { useState } from "react";
import { Glyph } from "./Glyph";

export function CopyButton({ value, label, done }: { value: string; label: string; done: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label={copied ? done : label}
      title={copied ? done : label}
      className={`btn-pixel h-8 w-9 shrink-0 px-0 ${copied ? "border-xp text-xp" : ""}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        } catch {}
      }}
    >
      {copied ? <span className="font-pixel">✓</span> : <Glyph name="copy" size={14} />}
    </button>
  );
}
