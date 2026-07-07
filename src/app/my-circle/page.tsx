import { redirect } from "next/navigation";

import { CircleFooterNav } from "@/components/circle/CircleFooterNav";
import { isLocalDevAuthEnabled, requireAuthenticatedUserEmail } from "@/lib/auth";
import { getMyCircleView } from "@/lib/circle";
import { getMemberEntryState } from "@/lib/intake";

import { sendCircleMessage, toggleSupportReaction } from "./actions";
import { CircleAutoRefresh } from "./CircleAutoRefresh";
import { MentionComposer } from "./MentionComposer";

type MyCirclePageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((value) => `${value}${value}`)
          .join("")
      : normalized;
  const value = Number.parseInt(full, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function bubbleStyle(accentColor: string) {
  const { r, g, b } = hexToRgb(accentColor);

  return {
    background: `linear-gradient(180deg, rgba(${r}, ${g}, ${b}, 0.28), rgba(${r}, ${g}, ${b}, 0.18))`,
    borderColor: `rgba(${r}, ${g}, ${b}, 0.32)`,
  };
}

function avatarStyle(accentColor: string) {
  const { r, g, b } = hexToRgb(accentColor);

  return {
    background: `rgba(${r}, ${g}, ${b}, 0.24)`,
    color: `rgb(${Math.max(28, r - 36)} ${Math.max(24, g - 36)} ${Math.max(20, b - 36)})`,
    borderColor: `rgba(${r}, ${g}, ${b}, 0.32)`,
  };
}

function renderMessageWithMentions(body: string, aliases: Map<string, string>) {
  const parts = body.split(/(@[A-Za-z][A-Za-z0-9_-]*)/g);

  return parts.map((part, index) => {
    if (!part.startsWith("@")) {
      return <span key={`${part}-${index}`}>{part}</span>;
    }

    const normalized = part.slice(1).toLowerCase();
    const label = aliases.get(normalized);

    if (!label) {
      return <span key={`${part}-${index}`}>{part}</span>;
    }

    return (
      <span className="circle-note-mention" key={`${part}-${index}`}>
        @{label}
      </span>
    );
  });
}

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
  const mentionAliases = new Map(
    circle.memberships
      .filter((member) => !member.isYou)
      .flatMap((member) => [
        [member.mentionAlias.toLowerCase(), member.mentionAlias],
        [member.pseudonym.replace(/\s+/g, "").toLowerCase(), member.mentionAlias],
      ])
  );

  return (
    <main className="cb-entry-page">
      <section className="circle-focus-shell">
        <div className="circle-room-shell">
          <CircleAutoRefresh />

          <div className="circle-topbar circle-topbar-simple">
            <p className="circle-topbar-brand">Cardio Bunny</p>
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
                    <span className="circle-chat-avatar" aria-hidden="true" style={avatarStyle(message.accentColor)}>
                      {message.authorName.slice(0, 1)}
                    </span>
                  ) : null}

                  <div
                    className={`circle-note ${message.isOwn ? "circle-note-own" : "circle-note-peer"}`}
                    style={bubbleStyle(message.accentColor)}
                  >
                    <p className="circle-note-author">{message.authorName}</p>
                    <p className="circle-note-body">
                      {renderMessageWithMentions(message.body, mentionAliases)}
                    </p>
                    <p className="circle-note-time">{message.relativeTime}</p>

                    <div className="circle-support-row">
                      <button className="circle-support-pill button-reset" type="button">
                        <span className="circle-support-pill-label">Reply</span>
                      </button>
                      {(["heart", "hug", "support"] as const).map((kind) => (
                        <form action={toggleSupportReaction} key={`${message.id}-${kind}`}>
                          <input name="messageId" type="hidden" value={message.id} />
                          <input name="kind" type="hidden" value={kind} />
                          <button
                            className={`circle-support-pill circle-support-pill-icon button-reset ${
                              kind === "heart"
                                ? "circle-support-pill-heart"
                                : kind === "hug"
                                  ? "circle-support-pill-hug"
                                  : "circle-support-pill-support"
                            } ${
                              message.supports[kind].reacted ? "circle-support-pill-active" : ""
                            }`}
                            type="submit"
                          >
                            <span aria-hidden="true" className="circle-support-pill-iconmark">
                              {kind === "heart" ? "♥" : kind === "hug" ? "✦" : "☀"}
                            </span>
                            <span className="sr-only">
                              {kind === "heart" ? "Heart" : kind === "hug" ? "Hug" : "Support"}
                            </span>
                            <span className="circle-support-pill-count">{message.supports[kind].count}</span>
                          </button>
                        </form>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <MentionComposer
              action={sendCircleMessage}
              error={error}
              prompt={circle.prompt}
            />
          </section>

          <CircleFooterNav active="circle" showDevSignOut={showDevSignOut} />
        </div>
      </section>
    </main>
  );
}
