import { redirect } from "next/navigation";

import { stopDeveloperSession } from "@/app/dev-sign-in/actions";
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

  return (
    <main className="cb-entry-page">
      <section className="circle-focus-shell">
        <div className="circle-room-shell">
          <header className="circle-room-header">
            <div className="circle-room-context circle-room-context-compact">
              <h1 className="circle-room-title">Your Circle</h1>
              <p className="circle-room-day">{circle.dayName}</p>
              <p className="circle-room-status">{circle.checkedInTodayCount} of 6 shared</p>
            </div>
            {showDevSignOut ? (
              <form action={stopDeveloperSession}>
                <button className="circle-settings-link button-reset" type="submit">
                  leave
                </button>
              </form>
            ) : null}
          </header>

          <section className="circle-room-panel">
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
                  rows={2}
                  required
                />
                <button className="cb-submit button-reset circle-share-button circle-share-button-inline" type="submit">
                  <span>Send</span>
                </button>
              </form>
            </section>
          </section>
        </div>
      </section>
    </main>
  );
}
