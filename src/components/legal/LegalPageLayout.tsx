import Link from 'next/link'

type LegalSection = {
  id: string
  title: string
  body: string[]
}

type LegalPageLayoutProps = {
  eyebrow: string
  title: string
  intro: string
  updatedAt: string
  sections: LegalSection[]
}

export function LegalPageLayout({
  eyebrow,
  title,
  intro,
  updatedAt,
  sections,
}: LegalPageLayoutProps) {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-bg pt-32 pb-18 sm:pt-36 sm:pb-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[28rem] w-[72rem] max-w-[92vw] rounded-full bg-brand-primary/6 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-20 h-56 w-56 rounded-full bg-brand-cta/6 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-6">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-primary">
              <span className="h-px w-8 bg-brand-primary" />
              {eyebrow}
            </div>
            <h1 className="font-serif text-5xl font-medium tracking-tight text-brand-text sm:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-brand-muted sm:text-xl">
              {intro}
            </p>
            <p className="mt-8 text-sm text-brand-muted">最後更新：{updatedAt}</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border-l border-brand-primary/20 pl-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-primary">
                本頁重點
              </p>
              <nav className="mt-5">
                <ul className="space-y-3 text-sm text-brand-muted">
                  {sections.map((section, index) => (
                    <li key={section.id}>
                      <Link
                        href={`#${section.id}`}
                        className="transition-colors hover:text-brand-text"
                      >
                        {String(index + 1).padStart(2, '0')} {section.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          <div className="space-y-14">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-28">
                <div className="max-w-3xl border-t border-brand-primary/12 pt-8 first:border-t-0 first:pt-0">
                  <h2 className="font-serif text-3xl font-medium text-brand-text sm:text-4xl">
                    {section.title}
                  </h2>
                  <div className="mt-5 space-y-4 text-base leading-8 text-brand-muted sm:text-lg">
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
