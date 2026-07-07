import Link from "next/link";

import { isLocalDevAuthEnabled } from "@/lib/auth";
import { requireAuthenticatedUserEmail } from "@/lib/auth";
import { getMyCircleView } from "@/lib/circle";
import { getMemberEntryState } from "@/lib/intake";
import { stopDeveloperSession } from "@/app/dev-sign-in/actions";
import { redirect } from "next/navigation";

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

  return (
    <main className="cb-entry-page">
      <section className="circle-focus-shell">
        <div className="circle-room-shell">
          <header className="circle-room-header">
            <div className="circle-room-context">
              <p className="circle-room-kicker">Your Circle</p>
              <h1 className="circle-room-title">{circle.weekRangeLabel}</h1>
              <p className="circle-room-subtitle">{circle.checkedInTodayCount} of 6 have shared today</p>
            </div>
            <div className="circle-room-settings">
              {showDevSignOut ? (
                <form action={stopDeveloperSession}>
                  <button className="circle-settings-link button-reset" type="submit">
                    leave
                  </button>
                </form>
              ) : (
                <Link className="circle-settings-link" href="/settings">
                  settings
                </Link>
              )}
            </div>
          </header>

          <section className="circle-room-panel">
            <div className="circle-member-list">
              {circle.memberships.map((member) => (
                <div className="circle-member-row" key={member.id}>
                  <div className="circle-member-namewrap">
                    <span className="circle-member-bunny" aria-hidden="true">
                      {member.isYou ? "Y" : member.pseudonym.slice(0, 1)}
                    </span>
                    <span className="circle-member-name">{member.isYou ? "You" : member.pseudonym}</span>
                  </div>
                  <span className={`circle-member-status ${member.hasPostedToday ? "circle-member-status-posted" : "circle-member-status-quiet"}`}>
                    {member.hasPostedToday ? "shared" : "quiet today"}
                  </span>
                </div>
              ))}
            </div>

            <section className="circle-composer-card">
              {error ? <p className="error-banner">{error}</p> : null}

              <form action={sendCircleMessage} className="composer-form circle-composer-form">
                <div className="circle-composer-head">
                  <h2>{circle.prompt}</h2>
                </div>
                <textarea
                  className="composer-textarea circle-journal-textarea"
                  name="body"
                  placeholder="Share something small..."
                  rows={4}
                  required
                />
                <button className="cb-submit button-reset circle-share-button" type="submit">
                  <span>Send</span>
                </button>
              </form>
            </section>

            <div className="circle-feed">
              {circle.messages.map((message) => (
                <article
                  className="circle-note"
                  key={message.id}
                >
                  <div className="circle-note-head">
                    <p className="circle-note-author">
                      {message.authorName} <span className="circle-note-separator">·</span> {message.relativeTime}
                    </p>
                  </div>
                  <p className="circle-note-body">{message.body}</p>
                </article>
              ))}
            </div>

            <footer className="circle-status-strip">
              <span>{circle.checkedInTodayCount} of 6 have shared today</span>
              <span>Circle closes Sunday night</span>
            </footer>
          </section>
        </div>
      </section>
    </main>
  );
}
