import { notFound } from "next/navigation";
import { BootScreen } from "@/components/BootScreen";
import { TopBar } from "@/components/TopBar";
import { PixelArt } from "@/components/PixelArt";
import { Inventory, type InventoryItem } from "@/components/Inventory";
import { CopyButton } from "@/components/CopyButton";
import { JsonLd } from "@/components/JsonLd";
import { hasLocale } from "@/lib/i18n";
import { absolute, cvPdf } from "@/lib/site";
import { attributes, person, projects, quests, skillLinks, skills, ui, vitals } from "@/content/profile";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = ui[lang];

  const items: InventoryItem[] = projects.map((p) => ({
    id: p.id,
    name: p.name,
    sprite: p.sprite,
    rarity: p.rarity,
    rarityLabel: t.rarity[p.rarity],
    context: p.context[lang],
    role: p.role[lang],
    summary: p.summary[lang],
    how: p.how[lang],
    purpose: p.purpose[lang],
    stack: p.stack,
    link: p.link,
  }));

  const nodeById = Object.fromEntries(skills.map((s) => [s.id, s]));

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
        image: absolute(`/${lang}/opengraph-image`),
        address: { "@type": "PostalAddress", addressLocality: person.location.city, addressRegion: person.location.region, addressCountry: person.location.country },
        sameAs: [person.github, person.linkedin],
        knowsAbout: skills.map((s) => s.label),
        knowsLanguage: ["pt-BR", "en"],
      },
      {
        "@type": "WebSite",
        "@id": absolute("/#website"),
        url: absolute(`/${lang}`),
        name: person.name,
        inLanguage: lang === "pt" ? "pt-BR" : "en-US",
        author: { "@id": absolute("/#person") },
      },
      {
        "@type": "ItemList",
        name: t.inventory,
        itemListElement: projects.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "CreativeWork",
            name: p.name,
            description: `${p.summary[lang]} ${p.how[lang]}`,
            keywords: p.stack.join(", "),
            creator: { "@id": absolute("/#person") },
            ...(p.link ? { url: p.link } : {}),
          },
        })),
      },
    ],
  };

  return (
    <>
      <BootScreen
        name={person.name}
        sub={`${person.jobTitle[lang]} · ${person.spec[lang]}`.toUpperCase()}
        press={t.pressStart}
        hint={t.pressHint}
        skip={t.skip}
        skipHref={`/${lang}/cv`}
      />
      <TopBar lang={lang} path="" />

      <main className="sheet">
        <div className="col">
          <section className="window identity enter" style={{ "--i": 0 } as React.CSSProperties} aria-labelledby="who">
            <div className="portrait">
              <PixelArt name="avatar" scale={6} title={person.name} />
            </div>
            <h1 id="who">{person.name}</h1>
            <p className="job">{person.jobTitle[lang]}</p>
            <dl>
              <dt>{t.cls}</dt>
              <dd>{person.cls[lang]}</dd>
              <dt>{t.spec}</dt>
              <dd>{person.spec[lang]}</dd>
              <dt>HQ</dt>
              <dd>
                {person.location.city}, {person.location.region} · Brasil
              </dd>
            </dl>
            <div className="bars">
              {vitals.map((v) => (
                <div key={v.key} className="bar">
                  <span>{v.key}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ "--w": `${v.value}%`, "--c": v.color } as React.CSSProperties} />
                  </div>
                  <span>{v.label[lang]}</span>
                </div>
              ))}
            </div>
            <p className="tagline">{person.tagline[lang]}</p>
          </section>

          <section className="window enter" style={{ "--i": 1 } as React.CSSProperties} aria-labelledby="attrs">
            <h2 className="window-title" id="attrs">
              {t.attributes}
            </h2>
            <div className="attrs">
              {attributes.map((a) => (
                <div key={a.label.en} className="attr">
                  <span>{a.label[lang]}</span>
                  <b>{a.value}</b>
                </div>
              ))}
            </div>
          </section>

          <section className="window party enter" style={{ "--i": 2 } as React.CSSProperties} aria-labelledby="party" id="contact">
            <h2 className="window-title" id="party">
              {t.party}
            </h2>
            <p>{t.partyText}</p>
            <ul>
              <li>
                <a href={person.github} target="_blank" rel="noopener noreferrer me">
                  <span className="k">GitHub</span>
                  <span className="v">github.com/{person.githubHandle}</span>
                </a>
              </li>
              <li>
                <a href={person.linkedin} target="_blank" rel="noopener noreferrer me">
                  <span className="k">LinkedIn</span>
                  <span className="v">in/guilherme-molari</span>
                </a>
              </li>
              <li>
                <div className="row">
                  <span className="k">E-mail</span>
                  <span className="v">
                    <a href={`mailto:${person.email}`}>
                      {person.email}
                    </a>
                  </span>
                  <CopyButton value={person.email} label={t.copy} done={t.copied} />
                </div>
              </li>
            </ul>
            <a className="chip-btn primary" href={cvPdf(lang)} download>
              ▼ {t.cv}
            </a>
          </section>
        </div>

        <div className="col">
          <section className="window enter" style={{ "--i": 1 } as React.CSSProperties} aria-labelledby="tree">
            <h2 className="window-title" id="tree">
              {t.skillTree} <small>{t.skillHint}</small>
            </h2>
            <div className="tree-scroll">
              <div className="tree">
                <svg className="links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  {skillLinks.map(([a, b]) => (
                    <line
                      key={a + b}
                      x1={nodeById[a].x}
                      y1={nodeById[a].y}
                      x2={nodeById[b].x}
                      y2={nodeById[b].y}
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                </svg>
                {skills.map((s, d) => (
                  <div
                    key={s.id}
                    className={`node ${s.level}${s.y > 60 ? " up" : ""}`}
                    style={{ left: `${s.x}%`, top: `${s.y}%`, "--d": d } as React.CSSProperties}
                    tabIndex={0}
                  >
                    <span>{s.label}</span>
                    <span className="tip" role="tooltip">
                      <b>{s.label}</b>
                      {s.level === "max" ? " · MAX" : ""}
                      <br />
                      {s.note[lang]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="window enter" style={{ "--i": 2 } as React.CSSProperties} aria-labelledby="quests">
            <h2 className="window-title" id="quests">
              {t.questLog}
            </h2>
            <ol className="quests">
              {quests.map((q) => (
                <li key={q.id} className="quest">
                  <span className="check" aria-label={t.completed}>
                    ✓
                  </span>
                  <div>
                    <h3>{q.title[lang]}</h3>
                    <div className="meta">
                      {q.role[lang]} · {q.org}
                    </div>
                    <p>{q.text[lang]}</p>
                  </div>
                  <span className="reward">{q.reward[lang]}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="window enter" style={{ "--i": 3 } as React.CSSProperties} aria-labelledby="inv" id="projects">
            <h2 className="window-title" id="inv">
              {t.inventory} <small>{t.inventoryHint}</small>
            </h2>
            <Inventory
              items={items}
              labels={{ howItWorks: t.howItWorks, purpose: t.purpose, stack: t.stack, role: t.role, source: t.source }}
            />
          </section>
        </div>
      </main>
      <footer className="footer">
        © {person.name} · {t.footer}
      </footer>
      <JsonLd data={jsonLd} />
    </>
  );
}
