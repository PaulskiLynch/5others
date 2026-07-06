import Link from "next/link";

type WaitingPageProps = {
  searchParams: Promise<{
    weekStart?: string;
    weekEnd?: string;
    mode?: string;
    band?: string;
  }>;
};

export default async function WaitingPage({ searchParams }: WaitingPageProps) {
  const { weekStart, weekEnd, mode, band } = await searchParams;

  return (
    <main className="page-shell">
      <section className="hero hero-grid">
        <div>
          <p className="eyebrow">Waiting Room</p>
          <h1>Your next circle starts on Monday.</h1>
          <p className="lede">
            5others does not drop people into half-formed rooms midweek. The pause
            is part of the design: one clean beginning, one shared rhythm, one
            ending.
          </p>
        </div>

        <aside className="hero-note">
          <p className="section-label">Current intake status</p>
          <p className="note-copy">
            Intake mode: <strong>{mode === "supabase" ? "saved to Supabase" : "preview mode"}</strong>
          </p>
        </aside>
      </section>

      <section className="panel">
        <div className="stack-list">
          <div className="stack-row">
            <span className="stack-dot" />
            <p>Week opens: {weekStart ?? "Next Monday"}</p>
          </div>
          <div className="stack-row">
            <span className="stack-dot" />
            <p>Week closes: {weekEnd ?? "That Sunday night"}</p>
          </div>
          <div className="stack-row">
            <span className="stack-dot" />
            <p>Timezone band: {band ?? "Compatible rhythm grouping"}</p>
          </div>
          <div className="stack-row">
            <span className="stack-dot" />
            <p>Midweek joiners wait. No guilt mechanics, no pressure loops.</p>
          </div>
        </div>

        <div className="cta-row">
          <Link className="primary-cta" href="/sign-in?next=/my-circle">
            Sign in to my circle
          </Link>
        </div>
      </section>
    </main>
  );
}
