import Image from "next/image";

import { isLocalDevAuthEnabled } from "@/lib/auth";
import { requireAuthenticatedUserEmail } from "@/lib/auth";
import { SignOutAction } from "@/components/auth/SignOutAction";
import { CircleBottomNav } from "@/components/circle/CircleBottomNav";
import { getMyCircleView } from "@/lib/circle";
import { hasPilotIntakeRequest } from "@/lib/intake";
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
  const hasIntake = await hasPilotIntakeRequest(email);
  const { error } = await searchParams;

  if (!hasIntake) {
    redirect("/onboarding?next=/my-circle");
  }

  const circle = await getMyCircleView(email);
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

        <div className="phone-shell phone-shell-wide">
          <div className="phone-week-note">
            <span className="phone-week-badge">One week only</span>
            <p>Six people. One private circle. A shared rhythm from Monday to Sunday.</p>
          </div>

          <div className="phone-shell-body">
            <div className="phone-topbar">
              <span className="phone-back">&lt;</span>
              <div className="phone-heading">
                <strong>My Circle</strong>
                <span>
                  {circle.memberCount} anonymous bunnies, {circle.category}
                </span>
              </div>
              {showDevSignOut ? (
                <form action={stopDeveloperSession}>
                  <button className="phone-signout button-reset" type="submit">
                    leave
                  </button>
                </form>
              ) : (
                <SignOutAction className="phone-signout button-reset" redirectTo="/" />
              )}
            </div>

            <div className="avatar-strip">
              {circle.memberships.map((member, index) => (
                <div className="avatar-token" key={member.id}>
                  <div
                    className="avatar-core"
                    style={{ background: `linear-gradient(180deg, ${member.accent_color}, #ffe9dd)` }}
                  >
                    <span>{member.pseudonym.split(" ").map((part) => part[0]).join("")}</span>
                  </div>
                  <small>{member.id === circle.userMembership.id ? "You" : `B${index + 1}`}</small>
                </div>
              ))}
            </div>

            <div className="bubble-stack">
              {circle.messages.map((message) => (
                <article
                  className={`chat-bubble chat-bubble-${message.tone} ${
                    message.isOwn ? "chat-bubble-self" : "chat-bubble-peer"
                  }`}
                  key={message.id}
                >
                  {!message.isOwn ? <p className="chat-author">{message.authorName}</p> : null}
                  <p className="chat-body">{message.body}</p>
                  <div className="chat-meta">
                    <span>{new Date(message.created_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
                    <span className="chat-soft-tag">one week only</span>
                  </div>
                </article>
              ))}
            </div>

            {error ? <p className="error-banner">{error}</p> : null}

            <form action={sendCircleMessage} className="composer-form">
              <textarea
                className="composer-textarea"
                name="body"
                placeholder="Share a small win, wobble, or reset..."
                rows={3}
                required
              />
              <div className="composer-actions">
                <p className="composer-note">{circle.prompt}</p>
                <button className="composer-send button-reset" type="submit">
                  ^
                </button>
              </div>
            </form>

            <div className="support-banner">
              <div className="support-icon">O</div>
              <p>
                Real messages now persist through protected session rules.
                {showDevSignOut ? " This local session is using the developer access shortcut." : ""}
              </p>
            </div>
          </div>

          <CircleBottomNav active="circle" />
        </div>
      </section>
    </main>
  );
}
