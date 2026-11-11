import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { Glyph } from "@/components/Glyph";
import { TechChip } from "@/components/TechIcon";
import { hasLocale } from "@/lib/i18n";
import { absolute, cvPdf, languageAlternates } from "@/lib/site";
import { stackItem } from "@/lib/stack-icons";
import { person, projects, quests, skillList, ui } from "@/content/profile";

export async function generateMetadata({ params }: PageProps<"/[lang]/cv">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return {
    title: ui[lang].cvTitle,
    description: person.summary[lang].slice(0, 155),
    alternates: { canonical: absolute(`/${lang}/cv`), languages: languageAlternates("/cv") },
  };
}

function H2({ children, icon }: { children: React.ReactNode; icon: Parameters<typeof Glyph>[0]["name"] }) {
  return (
    <h2 className="mt-8 mb-3 flex items-center gap-2 border-b-2 border-edge pb-1.5 font-pixel text-[19px] tracking-wider text-accent uppercase print:text-black">
      <Glyph name={icon} size={15} /> {children}
    </h2>
  );
}

/** Recruiter mode: plain, fast, fully indexable, printable. */
export default async function CvPage({ params }: PageProps<"/[lang]/cv">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = ui[lang];

  return (
    <>
      <TopBar lang={lang} path="/cv" cv />
      <main className="mx-auto max-w-[840px] px-4 pt-8 pb-16">
        <div className="no-print mb-4 flex flex-wrap gap-2.5">
          <a className="btn-pixel btn-gold" href={cvPdf(lang)} download>
            <Glyph name="download" size={14} /> {t.cv}
          </a>
        </div>

        <article className="print-plain rounded-lg border-2 border-edge bg-panel p-5 sm:p-10">
          <header className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            {person.photo && (
              <Image src={person.photo} alt={person.name} width={96} height={96} className="rounded-lg border-2 border-edge object-cover object-[50%_35%]" />
            )}
            <div className="min-w-0">
              <h1 className="m-0 font-pixel text-[clamp(30px,5vw,42px)] leading-none">{person.name}</h1>
              <p className="mt-1.5 mb-2 font-medium text-accent print:text-neutral-700">
                {person.jobTitle[lang]} · {person.spec[lang]}
              </p>
              <p className="m-0 flex flex-wrap gap-x-4 gap-y-1 text-[14px] text-muted">
                <span className="inline-flex items-center gap-1">
                  <Glyph name="pin" size={11} /> {person.location.city}, {person.location.region}, Brasil
                </span>
                <a href={`mailto:${person.email}`} className="inline-flex items-center gap-1 text-ink">
                  <Glyph name="mail" size={11} /> {person.email}
                </a>
                <a href={person.github} rel="me" className="text-ink">
                  github.com/{person.githubHandle}
                </a>
                <a href={person.linkedin} rel="me" className="text-ink">
                  linkedin.com/in/guilherme-molari-5203a8236
                </a>
              </p>
            </div>
          </header>

          <p className="mt-6 mb-0">{person.summary[lang]}</p>

          <H2 icon="scroll">{t.experience}</H2>
          {quests.map((q) => (
            <section key={q.id} className="mb-4">
              <h3 className="m-0 text-[16.5px] font-medium">
                {q.org} · <span className="text-muted">{q.role[lang]}</span>
              </h3>
              <p className="mt-1 mb-0">{q.text[lang]}</p>
            </section>
          ))}

          <H2 icon="bag">{t.projects}</H2>
          {projects.map((p) => (
            <section key={p.id} className="mb-5 break-inside-avoid">
              <h3 className="m-0 text-[16.5px] font-medium">{p.name}</h3>
              <div className="text-[14px] text-muted">
                {p.context[lang]} · {p.role[lang]}
              </div>
              <p className="mt-1 mb-0">
                {p.summary[lang]} {p.how[lang]}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5 print:hidden">
                {p.stack.map((s) => {
                  const it = stackItem(s);
                  return <TechChip key={s} icon={it.icon} name={it.name} />;
                })}
              </div>
              <div className="mt-1 hidden text-[13px] text-neutral-600 print:block">
                {t.stack}: {p.stack.join(", ")}
              </div>
              {p.link && (
                <a href={p.link} className="mt-1 inline-flex items-center gap-1 text-[13.5px] text-ink">
                  <Glyph name="external" size={10} /> {t.source}
                </a>
              )}
            </section>
          ))}

          <H2 icon="bolt">{t.skills}</H2>
          <p className="m-0">{skillList.join(" · ")}</p>
        </article>
      </main>
      <footer className="no-print px-4 pb-10 text-center font-pixel text-[13px] text-muted">© {person.name}</footer>
    </>
  );
}
