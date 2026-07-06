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
    body: "Matched with 5 other Cardio Bunnies on a similar path.",
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

export function CardioBunnyEntryShell({
  cardSubtitle,
  cardTitle,
  children,
}: CardioBunnyEntryShellProps) {
  return (
    <main className="cb-entry-page">
      <section className="cb-entry-shell">
        <div className="cb-entry-grid">
          <div className="cb-story-column">
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

            <p className="cb-kicker">A weekly circle for real support</p>
            <h1 className="cb-hero-title">You don&apos;t have to do this alone.</h1>
            <p className="cb-hero-copy">
              Join a Cardio Bunny circle for real, heart-centered support.
            </p>
            <p className="cb-hero-highlight">One week. One circle. You belong here.</p>

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

            <blockquote className="cb-quote-card">
              <p className="cb-quote-mark">66</p>
              <p className="cb-quote-copy">
                This circle changed everything. I finally felt seen, supported, and not so alone.
              </p>
              <footer className="cb-quote-credit">Circle Member</footer>
            </blockquote>

            <p className="cb-privacy-note">
              Your privacy is protected.
              <br />
              Real names are never shared.
            </p>
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

      <div className="cb-entry-footer">
        <div aria-hidden="true" className="cb-entry-footer-icon">
          OO
        </div>
        <p>6 people. 1 circle. Real support.</p>
        <span>New circles start every week.</span>
      </div>
    </main>
  );
}
