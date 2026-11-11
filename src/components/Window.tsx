import { Glyph, type GlyphName } from "./Glyph";

type Props = {
  id: string;
  title: string;
  icon: GlyphName;
  hint?: string;
  index?: number;
  className?: string;
  children: React.ReactNode;
};

/** A section as an SNES menu window: gold icon badge, pixel title, checkered rule. */
export function Window({ id, title, icon, hint, index = 0, className = "", children }: Props) {
  return (
    <section
      aria-labelledby={id}
      className={`window @container animate-enter p-4 sm:p-5 ${className}`}
      style={{ animationDelay: `${index * 110 + 100}ms` }}
    >
      <header className="mb-4 flex items-center gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-md border-2 border-[#fff3c4] bg-linear-to-b from-[#ffe7a3] to-accent text-[#3a2400] shadow-[0_0_0_2px_var(--frame-in)]">
          <Glyph name={icon} size={18} />
        </span>
        <h2 id={id} className="m-0 min-w-0 font-pixel text-[15px] leading-tight tracking-[0.08em] text-balance text-accent uppercase">
          {title}
        </h2>
        <span className="rule-pixel hidden min-w-6 flex-1 @xs:block" aria-hidden="true" />
        {hint && <small className="hidden text-xs text-muted @md:block">{hint}</small>}
      </header>
      {children}
    </section>
  );
}
