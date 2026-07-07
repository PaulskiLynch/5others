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
  const timezoneLabel = band ?? "UTC+0";
  const sharedStartNote = (
    <>
      <p className="cb-waiting-note-title">Why everyone starts together</p>
      <p>We believe every circle should begin at the same moment.</p>
      <p>
        Starting together means every member feels included from the very first conversation.
      </p>
      <p>No catching up.</p>
      <p>No joining halfway through.</p>
      <p>Just six people beginning together.</p>
    </>
  );

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
              <h1 className="cb-waiting-title">Your place is reserved.</h1>
              <p className="cb-waiting-copy">
                We&apos;re carefully matching you with five other people who are walking a similar
                path.
              </p>
              <p className="cb-waiting-highlight">Everyone begins together.</p>
              <div className="cb-waiting-body">
                <p>That means nobody joins halfway through.</p>
                <p>Nobody feels like an outsider.</p>
                <p>Everyone starts on the same day.</p>
                <p>That&apos;s worth waiting for.</p>
              </div>

              <div className="cb-waiting-promise">
                <p className="cb-waiting-promise-title">We&apos;ll hold your place.</p>
                <p>When your circle opens we&apos;ll bring you straight back.</p>
              </div>

              <div className="cb-waiting-checklist">
                <p>✓ Your place is reserved.</p>
                <p>✓ Your answers have been saved.</p>
                <p>✓ We&apos;ll let you know when it&apos;s time.</p>
              </div>
            </section>

            <aside className="cb-waiting-card">
              <p className="cb-how-kicker">Your upcoming circle</p>
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
                  <span>Your time zone</span>
                  <strong>{timezoneLabel}</strong>
                </div>
              </div>

              <div className="cb-waiting-note cb-waiting-note-desktop">
                {sharedStartNote}
              </div>

              <div className="cb-waiting-actions">
                <Link className="cb-submit button-reset cb-waiting-cta" href="/">
                  <span aria-hidden="true">[]</span>
                  <span>Got it</span>
                </Link>
                <Link className="cb-waiting-secondary" href="/">
                  Return to homepage
                </Link>
              </div>
            </aside>
          </div>

          <section className="cb-waiting-mobile-followup">
            <div className="cb-waiting-note cb-waiting-note-mobile">
              {sharedStartNote}
            </div>
          </section>
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
