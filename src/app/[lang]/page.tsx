import Image from "next/image";
import { notFound } from "next/navigation";
import { siGithub } from "simple-icons";
import { BootScreen } from "@/components/BootScreen";
import { TopBar } from "@/components/TopBar";
import { PixelArt } from "@/components/PixelArt";
import { Inventory, type InventoryItem } from "@/components/Inventory";
import { SkillTree, type TreeNode } from "@/components/SkillTree";
import { CopyButton } from "@/components/CopyButton";
import { JsonLd } from "@/components/JsonLd";
import { Window } from "@/components/Window";
import { Glyph, type GlyphName } from "@/components/Glyph";
import { Backdrop } from "@/components/Backdrop";
import { hasLocale } from "@/lib/i18n";
import { absolute, cvPdf } from "@/lib/site";
import { projectIcon } from "@/lib/pixel-icons";
import { skillIcons } from "@/lib/skill-icons";
import { stackItem } from "@/lib/stack-icons";
import { attributes, person, projects, quests, skillLinks, skills, ui, vitals } from "@/content/profile";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = ui[lang];
  const projectName = Object.fromEntries(projects.map((p) => [p.id, p.name]));

  const items: InventoryItem[] = projects.map((p) => ({
    id: p.id,
    name: p.name,
    icon: projectIcon(p.id),
    rarity: p.rarity,
    rarityLabel: t.rarity[p.rarity],
    context: p.context[lang],
    role: p.role[lang],
    summary: p.summary[lang],
    how: p.how[lang],
    purpose: p.purpose[lang],
    stack: p.stack.map(stackItem),
    link: p.link,
  }));

  const nodes: TreeNode[] = skills.map((s) => ({
    id: s.id,
    label: s.label,
    icon: skillIcons[s.icon],
    x: s.x,
    y: s.y,
    level: s.level,
    category: s.category[lang],
    note: s.note[lang],
    usedIn: s.usedIn.map((id) => ({ id, name: projectName[id] })),
    extras: s.extras.map(stackItem),
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": absolute("/#person"),
        name: person.name,
        jobTitle: person.jobTitle[lang],
        description: person.summary[lang],
        email: `mailto:${person.email}`,
        url: absolute(`/${lang}`),
        image: absolute(person.photo ?? `/${lang}/opengraph-image`),
        address: { "@type": "PostalAddress", addressLocality: person.location.city, addressRegion: person.location.region, addressCountry: person.location.country },
        sameAs: [person.github, person.linkedin],
        knowsAbout: skills.map((s) => s.label),
        knowsLanguage: ["pt-BR", "en"],
      },
      { "@type": "WebSite", "@id": absolute("/#website"), url: absolute(`/${lang}`), name: person.name, inLanguage: lang === "pt" ? "pt-BR" : "en-US", author: { "@id": absolute("/#person") } },
      {
        "@type": "ItemList",
        name: t.inventoryTitle,
        itemListElement: projects.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: { "@type": "CreativeWork", name: p.name, description: `${p.summary[lang]} ${p.how[lang]}`, keywords: p.stack.join(", "), creator: { "@id": absolute("/#person") }, ...(p.link ? { url: p.link } : {}) },
        })),
      },
    ],
  };

  const facts: { icon: GlyphName; label: string; value: string }[] = [
    { icon: "sword", label: t.cls, value: person.cls[lang] },
    { icon: "gem", label: t.spec, value: person.spec[lang] },
    { icon: "pin", label: "HQ", value: `${person.location.city}, ${person.location.region} · Brasil` },
  ];

  return (
    <>
      <Backdrop />
      <BootScreen
        name={person.name}
        sub={`${person.jobTitle[lang]} · ${person.spec[lang]}`.toUpperCase()}
        press={t.pressStart}
        hint={t.pressHint}
        skip={t.skip}
        skipHref={`/${lang}/cv`}
      />
      <TopBar lang={lang} path="" />

      <main className="mx-auto grid max-w-[1180px] items-start gap-5 px-4 pt-6 pb-16 sm:gap-6 sm:pt-8 lg:grid-cols-[340px_minmax(0,1fr)]">
        {/* ---------------- left column ---------------- */}
        <div className="grid min-w-0 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-1">
          {/* identity */}
          <section aria-labelledby="who" className="window @container animate-enter p-5 md:col-span-2 lg:col-span-1">
            <div className="grid items-center gap-5 @[520px]:grid-cols-[auto_minmax(0,1fr)]">
              <div className="group relative mx-auto pb-3">
                {/* 16-bit square frame: gold bevel, stepped corners, rivets */}
                <div className="portrait-frame relative size-[176px] p-[7px]">
                  <div className="relative size-full overflow-hidden bg-slot shadow-[inset_0_0_0_2px_var(--frame-in)]">
                    {person.photo ? (
                      <Image
                        src={person.photo}
                        alt={person.name}
                        fill
                        sizes="176px"
                        priority
                        className="object-cover object-[50%_35%] transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="grid size-full place-items-center">
                        <PixelArt name="avatar" scale={6} title={person.name} className="animate-float" />
                      </div>
                    )}
                    <span className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgb(0_0_0/0.10)_0_1px,transparent_1px_3px)] mix-blend-multiply" />
                    <span className="pointer-events-none absolute inset-0 shadow-[inset_0_0_18px_rgb(0_0_0/0.45)]" />
                    <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/20 opacity-0 group-hover:animate-shine group-hover:opacity-100" />
                  </div>
                  {["top-[3px] left-[3px]", "top-[3px] right-[3px]", "bottom-[3px] left-[3px]", "bottom-[3px] right-[3px]"].map((pos) => (
                    <i key={pos} className={`absolute ${pos} block size-[7px] bg-[#fff3c4] shadow-[1px_1px_0_#8a5a08,inset_-1px_-1px_0_#d99a1a]`} />
                  ))}
                </div>
                <span className="absolute bottom-0 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-md border-2 border-[#fff3c4] bg-linear-to-b from-[#ffe7a3] to-accent px-2 py-0.5 font-pixel text-[12px] whitespace-nowrap text-[#3a2400] shadow-[0_0_0_2px_var(--frame-in),0_3px_0_var(--shadow)]">
                  <Glyph name="star" size={11} /> LV · {vitals[2].label[lang].toUpperCase()}
                </span>
              </div>

              <div className="min-w-0 text-center @[520px]:text-left">
                <h1 id="who" className="m-0 font-pixel text-[30px] leading-[1.05] text-balance">
                  {person.name}
                </h1>
                <p className="mt-1.5 mb-3 font-medium">{person.jobTitle[lang]}</p>
                <ul className="m-0 grid list-none gap-1.5 p-0 text-left text-[13.5px]">
                  {facts.map((f) => (
                    <li key={f.label} className="flex items-center gap-2.5 rounded-md border border-edge/70 bg-slot/60 px-2.5 py-1.5">
                      <span className="text-accent">
                        <Glyph name={f.icon} size={14} />
                      </span>
                      <span className="sr-only">{f.label}: </span>
                      <span className="min-w-0 truncate">{f.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-5 grid gap-2.5">
              {vitals.map((v) => {
                const senior = v.key === "XP";
                return (
                  <div key={v.key} className="grid grid-cols-[22px_minmax(0,1fr)_auto] items-center gap-2.5" title={`${v.key} · ${v.label[lang]}`}>
                    <span style={{ color: v.color }}>
                      <Glyph name={v.icon} size={18} />
                    </span>
                    <div className="relative h-3.5 overflow-hidden rounded-[3px] border-2 border-frame-in bg-slot shadow-[0_0_0_1px_var(--edge)]">
                      <div className="bar-gloss h-full animate-fill" style={{ width: `${v.value}%`, backgroundColor: v.color }} />
                      <span className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0_9px,rgb(0_0_0/0.25)_9px_10px)]" />
                      {senior && <span className="absolute inset-y-0 -left-1/2 w-1/4 -skew-x-12 animate-shine bg-white/40" />}
                    </div>
                    {senior ? (
                      <span className="inline-flex items-center gap-1 rounded-md border-2 border-[#fff3c4] bg-linear-to-b from-[#ffe7a3] to-accent px-2 py-0.5 font-pixel text-[13px] text-[#3a2400] shadow-[0_0_0_2px_var(--frame-in)]">
                        <Glyph name="crown" size={12} /> {v.label[lang].toUpperCase()}
                      </span>
                    ) : (
                      <span className="w-[52px] text-right font-pixel text-[13px] text-muted tabular-nums">
                        {v.value}
                        <small className="text-[10px]">%</small>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="mt-4 mb-0 border-t-2 border-dashed border-edge pt-4 text-[14.5px] text-muted">{person.tagline[lang]}</p>
          </section>

          {/* attributes */}
          <Window id="attrs" title={t.attributes} icon="shield" index={1}>
            <div className="grid grid-cols-2 gap-2.5 @[480px]:grid-cols-3">
              {attributes.map((a) => (
                <div key={a.label.en} className="group rounded-md border-2 border-edge bg-slot p-2.5 transition duration-200 hover:-translate-y-1 hover:border-accent">
                  <div className="flex items-center justify-between gap-2">
                    <span className="grid size-7 place-items-center rounded-md bg-edge/60 text-accent transition-transform group-hover:scale-110 group-hover:-rotate-8">
                      <Glyph name={a.icon} size={15} />
                    </span>
                    <b className="font-pixel text-[26px] leading-none text-accent">{a.value}</b>
                  </div>
                  <div className="mt-1.5 truncate text-[11.5px] tracking-wider text-muted uppercase">{a.label[lang]}</div>
                  <div className="mt-1.5 flex gap-[2px]">
                    {Array.from({ length: 10 }, (_, i) => (
                      <i key={i} className={`block h-1.5 flex-1 rounded-[1px] ${i < Math.round(a.value / 2) ? "bg-accent" : "bg-edge/60"}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Window>

          {/* contact */}
          <Window id="party" title={t.party} icon="mail" index={2}>
            <p className="mt-0 mb-3 text-[14.5px] text-muted">{t.partyText}</p>
            <ul className="m-0 mb-4 grid list-none gap-2 p-0">
              <li>
                <a
                  href={person.github}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="flex items-center gap-3 rounded-md border-2 border-edge bg-slot px-3 py-2 text-ink no-underline transition hover:translate-x-1 hover:border-accent"
                >
                  <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true">
                    <path d={siGithub.path} fill="currentColor" />
                  </svg>
                  <span className="font-pixel text-[14px]">GitHub</span>
                  <span className="ml-auto truncate text-[13px] text-muted">@{person.githubHandle}</span>
                  <Glyph name="external" size={11} className="shrink-0 text-muted" />
                </a>
              </li>
              <li>
                <a
                  href={person.linkedin}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="flex items-center gap-3 rounded-md border-2 border-edge bg-slot px-3 py-2 text-ink no-underline transition hover:translate-x-1 hover:border-accent"
                >
                  <span className="text-[#4ba3e5]">
                    <Glyph name="linkedin" size={18} />
                  </span>
                  <span className="font-pixel text-[14px]">LinkedIn</span>
                  <span className="ml-auto truncate text-[13px] text-muted">guilherme-molari</span>
                  <Glyph name="external" size={11} className="shrink-0 text-muted" />
                </a>
              </li>
              <li className="flex items-center gap-3 rounded-md border-2 border-edge bg-slot py-1.5 pr-1.5 pl-3">
                <span className="text-accent">
                  <Glyph name="mail" size={18} />
                </span>
                <a href={`mailto:${person.email}`} className="min-w-0 flex-1 truncate text-[13.5px] text-ink no-underline hover:text-accent">
                  {person.email}
                </a>
                <CopyButton value={person.email} label={t.copy} done={t.copied} />
              </li>
            </ul>
            <a className="btn-pixel btn-gold w-full" href={cvPdf(lang)} download>
              <Glyph name="download" size={14} /> {t.cv}
            </a>
          </Window>
        </div>

        {/* ---------------- right column ---------------- */}
        <div className="grid min-w-0 gap-5 sm:gap-6">
          <Window id="tree" title={t.skillTree} icon="bolt" hint={t.skillHint} index={1}>
            <SkillTree nodes={nodes} links={skillLinks} labels={{ usedIn: t.usedIn, alsoWith: t.alsoWith, level: t.level, rank: t.rank, controls: t.treeControls }} />
          </Window>

          <Window id="quests" title={t.questLog} icon="scroll" index={2}>
            <ol className="m-0 grid list-none gap-3 p-0">
              {quests.map((q) => (
                <li
                  key={q.id}
                  className="group grid grid-cols-[52px_minmax(0,1fr)] items-start gap-3.5 rounded-md border-2 border-edge bg-slot p-3.5 transition duration-200 hover:translate-x-1.5 hover:border-accent hover:shadow-[-4px_0_0_var(--accent)]"
                >
                  <span
                    aria-hidden="true"
                    className="grid size-[52px] place-items-center rounded-lg border-3 border-[#fff3c4] bg-[linear-gradient(#ffe7a3_0_45%,var(--accent)_45%)] font-pixel text-[19px] font-bold text-[#1c1300] shadow-[0_0_0_2px_var(--frame-in),0_4px_0_var(--shadow)] transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-6"
                  >
                    {q.badge}
                  </span>
                  <div className="min-w-0">
                    <h3 className="m-0 font-pixel text-[21px] leading-tight">{q.org}</h3>
                    <div className="mt-0.5 mb-1.5 flex items-center gap-1.5 text-[13.5px] font-medium text-accent">
                      <Glyph name="flag" size={11} /> {q.role[lang]}
                    </div>
                    <p className="m-0 text-[14.5px] text-muted">{q.text[lang]}</p>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {q.tags[lang].map((tag) => (
                        <span key={tag} className="rounded-full border-2 border-edge bg-panel-2 px-2.5 py-px text-[12px]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </Window>

          <Window id="inv" title={t.inventoryTitle} icon="bag" hint={t.inventoryHint} index={3}>
            <Inventory items={items} labels={{ howItWorks: t.howItWorks, purpose: t.purpose, stack: t.stack, source: t.source, rarities: t.rarity }} />
          </Window>
        </div>
      </main>

      <footer className="px-4 pb-10 text-center font-pixel text-[13px] text-muted">
        © {person.name} · {t.footer}
      </footer>
      <JsonLd data={jsonLd} />
    </>
  );
}
