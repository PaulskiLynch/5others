import Image from "next/image";

import { stopDeveloperSession } from "@/app/dev-sign-in/actions";
import { SignOutAction } from "@/components/auth/SignOutAction";
import { CircleFooterNav } from "@/components/circle/CircleFooterNav";
import { isLocalDevAuthEnabled, requireAuthenticatedUserEmail } from "@/lib/auth";
import { getMyCircleView } from "@/lib/circle";

import { leaveCurrentCircleAction } from "./actions";
import { SettingsControls } from "./SettingsControls";

export default async function SettingsPage() {
  const email = await requireAuthenticatedUserEmail();
  const showDevSignOut = isLocalDevAuthEnabled();
  const circle = await getMyCircleView(email);

  return (
    <main className="cb-entry-page">
      <section className="circle-focus-shell">
        <div className="circle-room-shell">
          <div className="circle-topbar circle-topbar-simple">
            <p className="circle-topbar-brand">Cardio Bunny</p>
          </div>

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
              <p className="week-close-kicker">Settings</p>
              <h1 className="settings-title">Quiet controls</h1>
              <p className="settings-copy">
                A small amount of control. Nothing more than the circle needs.
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

              <SettingsControls
                members={circle.memberships.map((member) => ({
                  id: member.id,
                  name: member.pseudonym,
                  isYou: member.isYou,
                }))}
              />

              <section className="settings-card">
                <p className="settings-card-label">Participation</p>
                <div className="settings-row">
                  <div>
                    <strong>Leave this circle</strong>
                    <span>Step out of this week&apos;s room and return to the close page.</span>
                  </div>
                  <form action={leaveCurrentCircleAction}>
                    <button className="settings-link settings-link-danger button-reset" type="submit">
                      Leave circle
                    </button>
                  </form>
                </div>
                <div className="settings-row">
                  <div>
                    <strong>Log out</strong>
                    <span>Leave the app without changing your place in the circle.</span>
                  </div>
                  {showDevSignOut ? (
                    <form action={stopDeveloperSession}>
                      <button className="settings-link button-reset" type="submit">
                        Log out
                      </button>
                    </form>
                  ) : (
                    <SignOutAction className="settings-link button-reset" />
                  )}
                </div>
              </section>
            </div>
          </div>

          <CircleFooterNav active="settings" showDevSignOut={showDevSignOut} />
        </div>
      </section>
    </main>
  );
}
