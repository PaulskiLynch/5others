import Image from "next/image";
import Link from "next/link";

import { stopDeveloperSession } from "@/app/dev-sign-in/actions";
import { CircleBottomNav } from "@/components/circle/CircleBottomNav";
import { SignOutAction } from "@/components/auth/SignOutAction";
import { isLocalDevAuthEnabled, requireAuthenticatedUserEmail } from "@/lib/auth";

export default async function SettingsPage() {
  const email = await requireAuthenticatedUserEmail();
  const showDevSignOut = isLocalDevAuthEnabled();

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

        <div className="phone-shell phone-shell-wide settings-shell">
          <div className="settings-body">
            <p className="week-close-kicker">Minimal account</p>
            <h1 className="settings-title">Settings</h1>
            <p className="settings-copy">
              Enough control to feel safe. Not enough surface area to turn this into a hobby.
            </p>

            <section className="settings-card">
              <p className="settings-card-label">Account</p>
              <div className="settings-row">
                <div>
                  <strong>Email</strong>
                  <span>{email}</span>
                </div>
              </div>
            </section>

            <section className="settings-card">
              <p className="settings-card-label">Notifications</p>
              <div className="settings-row">
                <div>
                  <strong>Circle messages</strong>
                  <span>Quiet by default for MVP. We&apos;ll add preferences once the core loop is live.</span>
                </div>
              </div>
            </section>

            <section className="settings-card">
              <p className="settings-card-label">Participation</p>
              <div className="settings-row">
                <div>
                  <strong>Pause next week</strong>
                  <span>Skip the next match cycle and come back when you want to.</span>
                </div>
                <Link className="settings-link" href="/week-close">
                  Review close
                </Link>
              </div>
              <div className="settings-row">
                <div>
                  <strong>Leave this session</strong>
                  <span>Step out without deleting your access.</span>
                </div>
                {showDevSignOut ? (
                  <form action={stopDeveloperSession}>
                    <button className="settings-link button-reset" type="submit">
                      Sign out
                    </button>
                  </form>
                ) : (
                  <SignOutAction className="settings-link button-reset" />
                )}
              </div>
            </section>
          </div>

          <CircleBottomNav active="settings" />
        </div>
      </section>
    </main>
  );
}
