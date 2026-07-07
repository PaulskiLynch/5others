import Link from "next/link";
import { redirect } from "next/navigation";

import { stopDeveloperSession } from "@/app/dev-sign-in/actions";
import { SignOutAction } from "@/components/auth/SignOutAction";
import { isLocalDevAuthEnabled, requireAuthenticatedUserEmail } from "@/lib/auth";
import { getMyCircleView } from "@/lib/circle";
import { getMemberEntryState } from "@/lib/intake";

import { sendCircleMessage } from "./actions";

type MyCirclePageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function MyCirclePage({ searchParams }: MyCirclePageProps) {
  const email = await requireAuthenticatedUserEmail();
  const entryState = await getMemberEntryState(email);
  const { error } = await searchParams;

  if (!entryState.hasIntake) {
    redirect("/onboarding?next=/my-circle");
  }

  if (entryState.shouldWait) {
    redirect(
      `/waiting?weekStart=${encodeURIComponent(entryState.weekStart ?? "")}&weekEnd=${encodeURIComponent(
        entryState.weekEnd ?? ""
      )}&mode=supabase&band=${encodeURIComponent(entryState.timeZoneBand ?? "UTC+0")}`
    );
  }

  const circle = await getMyCircleView(email);
  const showDevSignOut = isLocalDevAuthEnabled();
  const statusText = circle.hasPostedToday
    ? "Everyone's taking this week one small step at a time."
    : `${circle.checkedInTodayCount} of 6 checked in`;

  return (
    <main className="cb-entry-page">
      <section className="circle-focus-shell">
        <div className="circle-room-shell">
          <div className="circle-topbar">
            <details className="circle-menu">
              <summary className="circle-topbar-button">☰</summary>
              <div className="circle-menu-panel">
                <Link className="circle-menu-link" href="/my-circle">
                  Your Circle
                </Link>
                <Link className="circle-menu-link" href="/week-close">
                  Previous Circles
                </Link>
                <Link className="circle-menu-link" href="/week-close">
                  Archive
                </Link>
                <Link className="circle-menu-link" href="/settings">
                  Settings
                </Link>
                <a className="circle-menu-link" href="mailto:hello@5others.com">
                  Help
                </a>
                {showDevSignOut ? (
                  <form action={stopDeveloperSession}>
                    <button className="circle-menu-link button-reset" type="submit">
                      Log out
                    </button>
                  </form>
                ) : (
                  <SignOutAction className="circle-menu-link button-reset" />
                )}
              </div>
            </details>

            <p className="circle-topbar-brand">Cardio Bunny</p>
            <Link className="circle-topbar-button circle-topbar-settings" href="/settings">
              ⚙
            </Link>
          </div>

          <header className="circle-room-header">
            <div className="circle-room-context circle-room-context-compact">
              <h1 className="circle-room-title">Your Circle</h1>
              <p className="circle-room-day">{circle.dayName}</p>
              <p className="circle-room-status">{statusText}</p>
            </div>
          </header>

          <section className="circle-room-panel">
            <div className="circle-room-intent">
              <p className="circle-room-intent-label">This week</p>
              <p className="circle-room-intent-copy">Heart health. Small consistent steps.</p>
            </div>

            <div className="circle-feed">
              {circle.messages.map((message) => (
                <article
                  className={`circle-chat-row ${message.isOwn ? "circle-chat-row-own" : "circle-chat-row-peer"} ${
                    message.groupedWithPrevious ? "circle-chat-row-grouped" : ""
                  }`}
                  key={message.id}
                >
                  {!message.isOwn ? (
                    <span className="circle-chat-avatar" aria-hidden="true">
                      {message.authorName.slice(0, 1)}
                    </span>
                  ) : null}
                  <div className={`circle-note ${message.isOwn ? "circle-note-own" : "circle-note-peer"}`}>
                    <p className="circle-note-author">{message.authorName}</p>
                    <p className="circle-note-body">{message.body}</p>
                    <p className="circle-note-time">{message.relativeTime}</p>
                  </div>
                </article>
              ))}
            </div>

            <section className="circle-composer-card circle-composer-sticky">
              {error ? <p className="error-banner">{error}</p> : null}

              <div className="circle-composer-head">
                <h2>{circle.prompt}</h2>
              </div>

              <form action={sendCircleMessage} className="composer-form circle-composer-form circle-composer-form-inline">
                <textarea
                  className="composer-textarea circle-journal-textarea"
                  name="body"
                  placeholder="Share something small..."
                  rows={1}
                  required
                />
                <button
                  aria-label="Send"
                  className="cb-submit button-reset circle-share-button circle-share-button-inline"
                  type="submit"
                >
                  <span>➜</span>
                </button>
              </form>
            </section>
          </section>
        </div>
      </section>
    </main>
  );
}
