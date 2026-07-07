import Image from "next/image";
import type { ReactNode } from "react";

type CardioBunnyEntryShellProps = {
  cardSubtitle: string;
  cardTitle: string;
  children: ReactNode;
};

const supportNotes = [
  {
    icon: "◎",
    title: "Five others, just like you.",
    body: "We match women walking a similar path.",
  },
  {
    icon: "♡",
    title: "Real conversations.",
    body: "A safe, private space to share your wins, challenges, and heart-health journey.",
  },
  {
    icon: "◫",
    title: "Weekly support.",
    body: "One week at a time to keep you accountable to yourself and your peers.",
  },
] as const;

const safetyBunnies = [
  { color: "#f5ede1", label: "Quiet bunny" },
  { color: "#e2c36f", label: "Golden bunny" },
  { color: "#efd8c0", label: "Soft bunny" },
  { color: "#f0c3c7", label: "Blush bunny" },
  { color: "#f6d6e1", label: "Rose bunny" },
] as const;

export function CardioBunnyEntryShell({
  cardSubtitle,
  cardTitle,
  children,
}: CardioBunnyEntryShellProps) {
  return (
    <main className="cb-entry-page">
      <section className="cb-simple-shell">
        <div className="cb-simple-phone">
          <div className="cb-simple-logo">
            <Image
              alt="Cardio Bunny Love Your Heart"
              className="cb-simple-logo-image"
              height={120}
              priority
              src="/cardiobunny-love-your-heart.png"
              width={360}
            />
          </div>

          <header className="cb-simple-hero">
            <h1 className="cb-simple-title">You don&apos;t have to do this alone.</h1>
            <p className="cb-simple-copy">
              Join this week&apos;s CardioBunny circles for real, heart-centered peer support. We
              quietly match you with five others on a similar path. This week&apos;s circles close
              Sunday night.
            </p>
          </header>

          <div className="cb-simple-features">
            {supportNotes.map((item) => (
              <article className="cb-simple-feature" key={item.title}>
                <div aria-hidden="true" className="cb-simple-feature-icon">
                  {item.icon}
                </div>
                <div>
                  <h2 className="cb-simple-feature-title">{item.title}</h2>
                  <p className="cb-simple-feature-copy">{item.body}</p>
                </div>
              </article>
            ))}
          </div>

          <section className="cb-safety-card">
            <p className="cb-safety-title">Your Circle Safety</p>
            <div className="cb-safety-row" aria-label="Circle safety">
              {safetyBunnies.map((bunny) => (
                <span
                  aria-label={bunny.label}
                  className="cb-safety-bunny"
                  key={bunny.label}
                  style={{ backgroundColor: bunny.color }}
                >
                  <span className="cb-safety-bunny-ears" />
                  <span className="cb-safety-bunny-face" />
                </span>
              ))}
            </div>
          </section>

          <section className="cb-simple-auth">
            <div className="cb-simple-auth-head">
              <h2 className="cb-simple-auth-title">{cardTitle}</h2>
              <p className="cb-simple-auth-subtitle">{cardSubtitle}</p>
            </div>

            {children}

            <p className="cb-simple-auth-foot">Secured by 5Others</p>
          </section>

          <footer className="cb-simple-footer">© 2026 CardioBunny. All rights reserved.</footer>
        </div>
      </section>
    </main>
  );
}
