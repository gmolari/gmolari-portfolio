"use client";

import { useState } from "react";

export function CopyButton({ value, label, done }: { value: string; label: string; done: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="chip-btn"
      style={{ height: 30, fontSize: 12 }}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        } catch {}
      }}
    >
      {copied ? done : label}
    </button>
  );
}
