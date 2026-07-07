import Image from "next/image";
import type { ReactNode } from "react";

type CardioBunnyEntryShellProps = {
  cardSubtitle: string;
  cardTitle: string;
  children: ReactNode;
};

const supportNotes = [
  {
    icon: "OO",
    title: "Five others, just like you",
    body: "We quietly match you with five others on a similar path.",
  },
  {
    icon: "[]",
    title: "Real conversations",
    body: "A safe space to share your fitness wins, challenges, and heart-health journey.",
  },
  {
    icon: "<3",
    title: "Weekly support",
    body: "A 2-minute weekly check-in that keeps you accountable to yourself.",
  },
] as const;

const modelNotes = [
  {
    title: "Never a crowd",
    body: "No feeds. No followers. No pressure to perform. Just six people in a private circle where everyone has room to be heard."
  },
  {
    title: "A fresh start every week",
    body: "This is not a lifelong commitment. Each week is a simple chance to check in, reset, and find support for what you are carrying right now."
  },
  {
    title: "More members means more circles",
    body: "We do not build bigger rooms. We build more small ones. Your circle always stays personal: five others, one shared path, one week of real support."
  },
] as const;

export function CardioBunnyEntryShell({
  cardSubtitle,
  cardTitle,
  children,
}: CardioBunnyEntryShellProps) {
  return (
    <main className="cb-entry-page">
      <section className="cb-entry-shell">
        <header className="cb-entry-header">
          <div className="cb-brand-lockup">
            <Image
              alt="Cardio Bunny Love Your Heart"
              className="cb-brand-image"
              height={180}
              priority
              src="/cardiobunny-love-your-heart.png"
              width={560}
            />
          </div>
        </header>

        <div className="cb-entry-grid">
          <div className="cb-story-column">
            <p className="cb-kicker">Cardio Bunny circles powered by 5Others</p>
            <h1 className="cb-hero-title">You don&apos;t have to do this alone.</h1>
            <p className="cb-hero-copy">
              Join this week&apos;s CardioBunny circles for real, heart-centered support.
            </p>
            <p className="cb-hero-urgency">This week&apos;s circles close Sunday night.</p>
            <p className="cb-hero-highlight">We quietly match you with five others on a similar path.</p>

            <div className="cb-feature-list">
              {supportNotes.map((item) => (
                <article className="cb-feature-row" key={item.title}>
                  <div aria-hidden="true" className="cb-feature-icon">
                    {item.icon}
                  </div>
                  <div>
                    <h2 className="cb-feature-title">{item.title}</h2>
                    <p className="cb-feature-copy">{item.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <section className="cb-form-card">
            <div className="cb-form-head">
              <h2 className="cb-form-title">{cardTitle}</h2>
              <p className="cb-form-subtitle">{cardSubtitle}</p>
            </div>

            {children}
          </section>
        </div>
      </section>

      <section className="cb-model-section">
        <div className="cb-model-shell">
          <div className="cb-model-header">
            <p className="cb-kicker">Why circles work</p>
            <h2 className="cb-model-title">Your circle stays small, no matter how many people join.</h2>
            <p className="cb-model-copy">
              Most communities get louder as they grow. CardioBunny doesn&apos;t. Every week, we
              quietly place you with five others on a similar path, so you can be seen instead of
              lost in a crowd.
            </p>
          </div>

          <div className="cb-model-grid">
            {modelNotes.map((item) => (
              <article className="cb-model-card" key={item.title}>
                <h3 className="cb-model-card-title">{item.title}</h3>
                <p className="cb-model-card-copy">{item.body}</p>
              </article>
            ))}
          </div>

          <div className="cb-model-foot">
            <blockquote className="cb-quote-card">
              <p className="cb-quote-mark">66</p>
              <p className="cb-quote-copy">
                This circle changed everything. I finally felt seen, supported, and not so alone.
              </p>
              <footer className="cb-quote-credit">CardioBunny member</footer>
            </blockquote>

            <div className="cb-trust-panel">
              <p className="cb-trust-title">Private. Weekly. Built around you.</p>
              <p className="cb-privacy-note">
                We never show real names inside the circle. We ask a few quiet questions, match
                you carefully, and then keep the experience calm so real support can happen naturally.
              </p>
              <p className="cb-trust-closing">
                The goal is not to build a crowd. It is to make sure you never have to walk alone.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
