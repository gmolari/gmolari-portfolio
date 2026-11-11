import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { hasLocale } from "@/lib/i18n";
import { absolute, cvPdf, languageAlternates } from "@/lib/site";
import { person, projects, quests, skillList, ui } from "@/content/profile";

export async function generateMetadata({ params }: PageProps<"/[lang]/cv">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = ui[lang];
  return {
    title: t.cvTitle,
    description: person.summary[lang].slice(0, 155),
    alternates: { canonical: absolute(`/${lang}/cv`), languages: languageAlternates("/cv") },
  };
}

/** Recruiter mode: plain, fast, fully indexable, printable. */
export default async function CvPage({ params }: PageProps<"/[lang]/cv">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = ui[lang];

  return (
    <>
      <TopBar lang={lang} path="/cv" cv />
      <main className="cv">
        <div className="cv-actions">
          <a className="chip-btn primary" href={cvPdf(lang)} download>
            ▼ {t.cv}
          </a>
        </div>
        <article className="cv-paper">
          <h1>{person.name}</h1>
          <p className="job">
            {person.jobTitle[lang]} · {person.spec[lang]}
          </p>
          <p className="contact">
            <span>
              {person.location.city}, {person.location.region}, Brasil
            </span>
            <a href={`mailto:${person.email}`}>{person.email}</a>
            <a href={person.github} rel="me">
              github.com/{person.githubHandle}
            </a>
            <a href={person.linkedin} rel="me">
              linkedin.com/in/guilherme-molari-5203a8236
            </a>
          </p>

          <p style={{ marginTop: 18 }}>{person.summary[lang]}</p>

          <h2>{t.experience}</h2>
          {quests.map((q) => (
            <section key={q.id} className="entry">
              <h3>
                {q.role[lang]} · {q.org}
              </h3>
              <p>{q.text[lang]}</p>
            </section>
          ))}

          <h2>{t.projects}</h2>
          {projects.map((p) => (
            <section key={p.id} className="entry">
              <h3>{p.name}</h3>
              <div className="sub">
                {p.context[lang]} · {p.role[lang]}
              </div>
              <p>
                {p.summary[lang]} {p.how[lang]}
              </p>
              <div className="stackline">
                {t.stack}: {p.stack.join(", ")}
                {p.link ? (
                  <>
                    {" · "}
                    <a href={p.link}>{t.source}</a>
                  </>
                ) : null}
              </div>
            </section>
          ))}

          <h2>{t.skills}</h2>
          <p>{skillList.join(" · ")}</p>
        </article>
      </main>
      <footer className="footer">© {person.name}</footer>
    </>
  );
}
