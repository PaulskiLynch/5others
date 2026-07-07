import Link from "next/link";
import Image from "next/image";

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
            <div className="circle-room-brand">
              <Image
                alt="Cardio Bunny Love Your Heart"
                className="circle-room-brand-image"
                height={60}
                priority
                src="/cardiobunny-love-your-heart.png"
                width={180}
              />
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
            <div className="circle-room-context">
              <p className="circle-room-kicker">Your Circle</p>
              <h1 className="circle-room-title">Day {circle.dayNumber} of 7</h1>
              <div className="circle-room-meta">
                <span>{circle.weekRangeLabel}</span>
                <span>{circle.checkedInTodayCount} of 6 people have checked in today</span>
              </div>
              <p className="circle-room-dayline">{circle.dayLabel}</p>
            </div>

            <div className="circle-member-list">
              {circle.memberships.map((member) => (
                <div className="circle-member-row" key={member.id}>
                  <div className="circle-member-namewrap">
                    <span className="circle-member-bunny">OO</span>
                    <span className="circle-member-name">{member.isYou ? "You" : member.pseudonym}</span>
                  </div>
                  <span
                    className={`circle-member-status ${
                      member.hasPostedToday ? "circle-member-status-posted" : "circle-member-status-quiet"
                    }`}
                  >
                    {member.hasPostedToday ? "posted today" : "hasn't checked in yet"}
                  </span>
                </div>
              ))}
            </div>

            <section className="circle-composer-card">
              <div className="circle-composer-head">
                <h2>Write to your circle</h2>
                <p>Take your time. This can be brief.</p>
              </div>

              {error ? <p className="error-banner">{error}</p> : null}

              <form action={sendCircleMessage} className="composer-form circle-composer-form">
                <textarea
                  className="composer-textarea circle-journal-textarea"
                  name="body"
                  placeholder={"Share a small win...\nShare a wobble...\nAsk for encouragement..."}
                  rows={5}
                  required
                />
                <div className="circle-composer-prompt">
                  <p className="circle-composer-prompt-label">Today&apos;s reflection</p>
                  <p className="circle-composer-prompt-body">&ldquo;{circle.prompt}&rdquo;</p>
                </div>
                <button className="cb-submit button-reset circle-share-button" type="submit">
                  <span>Share with my circle</span>
                </button>
              </form>
            </section>

            {!circle.hasPostedToday ? (
              <section className="circle-reflection-card">
                <p className="circle-reflection-kicker">{circle.promptTitle}</p>
                <h2>{circle.prompt}</h2>
                <p>Take 30 seconds.</p>
                <p>There is no perfect answer.</p>
              </section>
            ) : null}

            <div className="circle-feed">
              {circle.messages.map((message) => (
                <article
                  className={`circle-note circle-note-${message.tone} ${
                    message.groupedWithPrevious ? "circle-note-grouped" : ""
                  } ${message.isOwn ? "circle-note-own" : "circle-note-peer"}`}
                  key={message.id}
                >
                  <div className="circle-note-head">
                    <p className="circle-note-author">{message.authorName}</p>
                    <p className="circle-note-time">{message.relativeTime}</p>
                  </div>
                  <p className="circle-note-body">{message.body}</p>
                </article>
              ))}
            </div>

            <footer className="circle-status-strip">
              <span>Day {circle.dayNumber} of 7</span>
              <span>Circle closes Sunday</span>
              <span>{circle.checkedInTodayCount} people checked in today</span>
            </footer>
          </section>
        </div>
      </section>
    </main>
  );
}
