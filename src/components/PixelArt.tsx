import { sprites, type Sprite } from "./sprites";

type Props = {
  name: keyof typeof sprites;
  /** Rendered size of one art pixel, in CSS px. */
  scale?: number;
  className?: string;
  title?: string;
};

/** Renders a sprite as crisp SVG rects, merging horizontal runs of the same color. */
export function PixelArt({ name, scale = 3, className, title }: Props) {
  const sprite: Sprite = sprites[name];
  const h = sprite.rows.length;
  const w = sprite.rows[0].length;
  const rects: React.ReactNode[] = [];

  sprite.rows.forEach((row, y) => {
    let x = 0;
    while (x < w) {
      const ch = row[x];
      let run = 1;
      while (x + run < w && row[x + run] === ch) run++;
      const fill = sprite.palette[ch];
      if (ch !== "." && fill) rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={run} height={1} fill={fill} />);
      x += run;
    }
  });

  return (
    <svg
      className={className}
      viewBox={`0 0 ${w} ${h}`}
      width={w * scale}
      height={h * scale}
      shapeRendering="crispEdges"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {rects}
    </svg>
  );
}
