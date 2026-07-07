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
    body: "We match you with five others on a similar path.",
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
    title: "Every circle has 6 people",
    body: "The CardioBunny experience is designed around one small, matched circle of six people."
  },
  {
    title: "6 users = 1 complete circle",
    body: "The product does not need a huge crowd to become useful. One complete circle is enough to deliver the full experience."
  },
  {
    title: "60 users = 10 circles",
    body: "As more members join, we do not create a noisy feed. We simply create more carefully matched circles."
  },
  {
    title: "600 users = 100 circles",
    body: "Scale does not change the feel of the product. It only means more small rooms, each with the same calm structure."
  },
  {
    title: "Growth stays personal",
    body: "More members simply means more small, carefully matched circles rather than one giant community competing for attention."
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
            <p className="cb-hero-highlight">We match you with five others on a similar path.</p>

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
            <h2 className="cb-model-title">CardioBunny works from the very first complete circle.</h2>
            <p className="cb-model-copy">
              Most communities need scale before they become useful. CardioBunny works from the
              first complete circle. Whether there are 6 members or 1 million, your experience
              stays personal: five others, one shared path, one week of real support.
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
              <footer className="cb-quote-credit">Cardio Bunny circle member</footer>
            </blockquote>

            <div className="cb-trust-panel">
              <p className="cb-trust-title">Private, weekly, and powered by small matched circles</p>
              <p className="cb-privacy-note">
                Real names are never shown inside the circle. We ask a few quiet matching
                questions, place you into a weekly cohort, and keep the experience calm instead of noisy.
              </p>
              <div className="cb-entry-footer">
                <div aria-hidden="true" className="cb-entry-footer-icon">
                  OO
                </div>
                <p>6 people. 1 circle. Real support.</p>
                <span>More members simply means more carefully matched CardioBunny circles.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
