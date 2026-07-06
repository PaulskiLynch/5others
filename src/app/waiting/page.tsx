import Link from "next/link";
import Image from "next/image";

import { getRequestBrandKey } from "@/lib/brand";

type WaitingPageProps = {
  searchParams: Promise<{
    weekStart?: string;
    weekEnd?: string;
    mode?: string;
    band?: string;
  }>;
};

function formatWeekDate(date?: string) {
  if (!date) {
    return null;
  }

  const parsed = new Date(`${date}T12:00:00Z`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
  }).format(parsed);
}

export default async function WaitingPage({ searchParams }: WaitingPageProps) {
  const { weekStart, weekEnd, mode, band } = await searchParams;
  const brand = await getRequestBrandKey();
  const formattedWeekStart = formatWeekDate(weekStart) ?? "Next Monday";
  const formattedWeekEnd = formatWeekDate(weekEnd) ?? "That Sunday night";

  if (brand === "cardiobunny") {
    return (
      <main className="cb-entry-page cb-waiting-page">
        <section className="cb-entry-shell cb-waiting-shell">
          <div className="cb-waiting-grid">
            <section className="cb-waiting-story">
              <div className="cb-brand-lockup cb-waiting-lockup">
                <Image
                  alt="Cardio Bunny Love Your Heart"
                  className="cb-brand-image cb-waiting-image"
                  height={180}
                  priority
                  src="/cardiobunny-love-your-heart.png"
                  width={560}
                />
              </div>

              <p className="cb-kicker">You&apos;re in</p>
              <h1 className="cb-waiting-title">Your circle is getting ready.</h1>
              <p className="cb-waiting-copy">
                Cardio Bunny circles begin together so nobody is dropped into a half-formed room.
                This short pause is part of the care.
              </p>
              <p className="cb-waiting-highlight">
                We&apos;ll hold your place and match you into this coming week&apos;s circle.
              </p>

              <div className="cb-waiting-steps">
                <article className="cb-waiting-step">
                  <div aria-hidden="true" className="cb-waiting-step-icon">
                    01
                  </div>
                  <div>
                    <h2>We saved your place</h2>
                    <p>{mode === "supabase" ? "Your intake is safely saved." : "Your intake is in preview mode right now."}</p>
                  </div>
                </article>
                <article className="cb-waiting-step">
                  <div aria-hidden="true" className="cb-waiting-step-icon">
                    02
                  </div>
                  <div>
                    <h2>Circles open together</h2>
                    <p>New matches begin on {formattedWeekStart} so everyone starts with the same rhythm.</p>
                  </div>
                </article>
                <article className="cb-waiting-step">
                  <div aria-hidden="true" className="cb-waiting-step-icon">
                    03
                  </div>
                  <div>
                    <h2>Return quietly</h2>
                    <p>When your session is active, we&apos;ll bring you straight back to your circle.</p>
                  </div>
                </article>
              </div>
            </section>

            <aside className="cb-waiting-card">
              <p className="cb-how-kicker">This week</p>
              <div className="cb-waiting-meta">
                <div className="cb-waiting-meta-row">
                  <span>Circle opens</span>
                  <strong>{formattedWeekStart}</strong>
                </div>
                <div className="cb-waiting-meta-row">
                  <span>Circle closes</span>
                  <strong>{formattedWeekEnd}</strong>
                </div>
                <div className="cb-waiting-meta-row">
                  <span>Rhythm group</span>
                  <strong>{band ?? "Compatible rhythm grouping"}</strong>
                </div>
              </div>

              <div className="cb-waiting-note">
                <p className="cb-waiting-note-title">Why the pause?</p>
                <p>
                  Midweek joiners wait by design. A calm beginning matters more than dropping people
                  into a room already in motion.
                </p>
              </div>

              <div className="cta-row">
                <Link className="cb-submit button-reset cb-waiting-cta" href="/sign-in?next=/my-circle">
                  <span aria-hidden="true">[]</span>
                  <span>Open my sign-in</span>
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </main>
    );
  }

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
            <p>Week opens: {formattedWeekStart}</p>
          </div>
          <div className="stack-row">
            <span className="stack-dot" />
            <p>Week closes: {formattedWeekEnd}</p>
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
