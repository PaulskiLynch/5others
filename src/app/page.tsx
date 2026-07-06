import Link from "next/link";
import { redirect } from "next/navigation";
import { CardioBunnyJoinScreen } from "@/components/cardio-bunny/CardioBunnyJoinScreen";
import { getAuthenticatedUserEmail } from "@/lib/auth";
import { getRequestBrandKey } from "@/lib/brand";

import {
  antiFeatures,
  phaseOneSlices,
  primeDirective,
  productDefinition,
  safetyPrinciples,
  weeklyLifecycle,
} from "@/lib/product";

export default async function Home() {
  const brand = await getRequestBrandKey();
  const authenticatedEmail = await getAuthenticatedUserEmail();

  if (authenticatedEmail) {
    redirect("/my-circle");
  }

  if (brand === "cardiobunny") {
    return <CardioBunnyJoinScreen />;
  }

  return (
    <main className="page-shell">
      <section className="hero hero-grid">
        <div>
          <p className="eyebrow">MVP Build Direction</p>
          <h1>Six anonymous people. One private circle. One week.</h1>
          <p className="lede">{productDefinition}</p>

          <div className="cta-row">
            <Link className="primary-cta" href="/sign-in?next=/my-circle">
              Open my circle
            </Link>
            <Link className="secondary-cta" href="/join">
              Join the seed cohort
            </Link>
          </div>
        </div>

        <aside className="hero-note">
          <p className="section-label">Prime directive</p>
          <p className="note-copy">{primeDirective}</p>
        </aside>
      </section>

      <section className="panel">
        <div className="split-head">
          <div>
            <p className="section-label">What It Refuses</p>
            <h2>The anti-features are the product.</h2>
          </div>
          <p className="supporting-copy">
            We are not building a social graph with encouragement layered on top.
            We are building a weekly ritual that protects privacy, calm, and
            follow-through.
          </p>
        </div>

        <div className="grid grid-tight">
          {antiFeatures.map((item, index) => (
            <article className="card" key={item}>
              <span className="card-index">0{index + 1}</span>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel" id="loop">
        <div className="split-head">
          <div>
            <p className="section-label">Weekly State Machine</p>
            <h2>Build the loop before the extras.</h2>
          </div>
          <p className="supporting-copy">
            The MVP wins when a stranger can join, get matched, feel encouraged,
            watch the circle close, and come back next Monday.
          </p>
        </div>

        <div className="timeline">
          {weeklyLifecycle.map((step) => (
            <article className="timeline-step" key={step.time}>
              <p className="timeline-time">{step.time}</p>
              <h3>{step.label}</h3>
              <p>{step.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="split-head">
          <div>
            <p className="section-label">Phase 1</p>
            <h2>Ship the smallest complete loop.</h2>
          </div>
          <p className="supporting-copy">
            Phase 1 is not a teaser. It is the full promise in compact form.
          </p>
        </div>

        <div className="stack-list">
          {phaseOneSlices.map((item) => (
            <div className="stack-row" key={item}>
              <span className="stack-dot" />
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel" id="safety">
        <div className="split-head">
          <div>
            <p className="section-label">Safety Layer</p>
            <h2>Anonymous and vulnerable means safety ships first.</h2>
          </div>
          <p className="supporting-copy">
            Crisis handling, reporting, filtering, and data minimization are
            launch requirements, not polishing passes.
          </p>
        </div>

        <div className="grid grid-tight">
          {safetyPrinciples.map((item, index) => (
            <article className="card card-accent" key={item}>
              <span className="card-index">S{index + 1}</span>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
