import {
  siCapacitor, siClaude, siDotnet, siExpo, siFigma, siKotlin, siNestjs, siNextdotjs, siNodedotjs,
  siPostgresql, siReact, siTypescript,
} from "simple-icons";
import type { SkillIcon } from "@/content/profile";

/** Either a 24×24 Simple Icons path or a tiny pixel glyph (for tools Simple Icons doesn't ship). */
export type IconData = { kind: "path"; path: string; hex: string } | { kind: "pixel"; rows: string[]; hex: string };

const path = (i: { path: string; hex: string }): IconData => ({ kind: "path", path: i.path, hex: `#${i.hex}` });

export const skillIcons: Record<SkillIcon, IconData> = {
  typescript: path(siTypescript),
  react: path(siReact),
  nextjs: path(siNextdotjs),
  nodejs: path(siNodedotjs),
  nestjs: path(siNestjs),
  dotnet: path(siDotnet),
  postgresql: path(siPostgresql),
  expo: path(siExpo),
  kotlin: path(siKotlin),
  capacitor: path(siCapacitor),
  claude: path(siClaude),
  figma: path(siFigma),
  pixijs: {
    kind: "pixel",
    hex: "#e72264",
    rows: ["#####..", "##..##.", "##..##.", "#####..", "##.....", "##.....", "##....#"],
  },
};
