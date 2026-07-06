import Image from "next/image";
import Link from "next/link";

import { requireAuthenticatedUserEmail } from "@/lib/auth";
import { CircleBottomNav } from "@/components/circle/CircleBottomNav";

export default async function WeekClosePage() {
  await requireAuthenticatedUserEmail();

  return (
    <main className="cb-entry-page">
      <section className="circle-focus-shell">
        <div className="circle-brand-ribbon">
          <Image
            alt="Cardio Bunny Love Your Heart"
            className="circle-brand-image"
            height={120}
            priority
            src="/cardiobunny-love-your-heart.png"
            width={360}
          />
        </div>

        <div className="phone-shell phone-shell-wide week-close-shell">
          <div className="week-close-body">
            <div className="week-close-mark">O</div>
            <p className="week-close-kicker">Circle closing</p>
            <h1 className="week-close-title">This circle is complete.</h1>
            <p className="week-close-copy">
              You showed up for five others this week. And they showed up for you.
            </p>
            <p className="week-close-copy week-close-copy-soft">
              No scoreboard. No streaks. Just the quiet fact that you did not carry this week alone.
            </p>

            <blockquote className="week-close-quote">
              Sometimes reading someone else&apos;s small victory becomes the hope you borrow
              until your own returns.
            </blockquote>

            <div className="week-close-actions">
              <Link className="cb-submit week-close-primary" href="/join">
                <span>Join next week&apos;s circle</span>
              </Link>
              <Link className="week-close-secondary" href="/settings">
                Pause for now
              </Link>
            </div>

            <p className="week-close-footer">
              Weekly circles close with care. The point is not to keep you scrolling.
            </p>
          </div>

          <CircleBottomNav active="week-close" />
        </div>
      </section>
    </main>
  );
}
