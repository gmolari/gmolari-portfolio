import {
  siAndroid, siCapacitor, siClaude, siDrizzle, siExpo, siFramer, siGoogleadmob, siHtml5, siJavascript, siKotlin,
  siNestjs, siNextdotjs, siOpenjdk, siPostgresql, siPrisma, siReact, siReactquery, siSocketdotio, siTailwindcss,
  siThreedotjs, siTypescript, siVercel, siVite, siWebgl,
} from "simple-icons";
import type { IconData } from "./skill-icons";
import { skillIcons } from "./skill-icons";

const p = (i: { path: string; hex: string }): IconData => ({ kind: "path", path: i.path, hex: `#${i.hex}` });

const map: Record<string, IconData> = {
  "Next.js": p(siNextdotjs),
  React: p(siReact),
  "React Native": p(siReact),
  TypeScript: p(siTypescript),
  JavaScript: p(siJavascript),
  "Framer Motion": p(siFramer),
  "React Query": p(siReactquery),
  "Socket.IO": p(siSocketdotio),
  Vite: p(siVite),
  Capacitor: p(siCapacitor),
  AdMob: p(siGoogleadmob),
  Canvas: p(siHtml5),
  "Android WebView": p(siAndroid),
  Expo: p(siExpo),
  NestJS: p(siNestjs),
  Prisma: p(siPrisma),
  PostgreSQL: p(siPostgresql),
  Tailwind: p(siTailwindcss),
  "Three.js": p(siThreedotjs),
  Drizzle: p(siDrizzle),
  "Vercel Blob": p(siVercel),
  Kotlin: p(siKotlin),
  Java: p(siOpenjdk),
  WebGL: p(siWebgl),
  "Claude Code": p(siClaude),
  PixiJS: skillIcons.pixijs,
  "PixiJS v8": skillIcons.pixijs,
};

export type StackItem = { name: string; icon: IconData | null };

export const stackItem = (name: string): StackItem => ({ name, icon: map[name] ?? null });
