"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type SupportCounts = {
  heart: number;
  hug: number;
  support: number;
};

type SupportState = {
  heart: boolean;
  hug: boolean;
  support: boolean;
};

type DemoMessage = {
  accentColor: string;
  author: string;
  avatarSrc: string;
  body: string;
  own: boolean;
  replyTo?: {
    author: string;
    body: string;
  };
  supports: SupportCounts;
  time: string;
};

const initialMessages: DemoMessage[] = [
  {
    author: "Silver Cottontail",
    avatarSrc: "/demo-bunnies/bunny-1.png",
    accentColor: "#e7d6b5",
    time: "9:15 AM",
    body: "I restarted my morning walk today. Only twelve minutes, but it counted.",
    own: false,
    supports: { heart: 1, hug: 0, support: 0 },
  },
  {
    author: "Gentle Cottontail",
    avatarSrc: "/demo-bunnies/bunny-3.png",
    accentColor: "#f1d9d8",
    time: "9:17 AM",
    body: "That absolutely counts. I am beginning again too.",
    own: false,
    supports: { heart: 1, hug: 1, support: 0 },
  },
  {
    author: "Brave Cottontail",
    avatarSrc: "/demo-bunnies/bunny-6.png",
    accentColor: "#f2e3c9",
    time: "9:19 AM",
    body: "Water first, shoes on second. What is the smallest version of the walk you can do today?",
    own: false,
    supports: { heart: 0, hug: 0, support: 1 },
  },
  {
    author: "Open Cottontail",
    avatarSrc: "/demo-bunnies/bunny-5.png",
    accentColor: "#d4e3d5",
    time: "9:22 AM",
    body: "Mine is just to get outside before lunch. I keep overthinking it when I stay indoors.",
    own: false,
    supports: { heart: 0, hug: 0, support: 0 },
  },
  {
    author: "You",
    avatarSrc: "/demo-bunnies/bunny-2.png",
    accentColor: "#e0c070",
    time: "9:24 AM",
    body: "Mine is simply shoes on. No promises beyond that.",
    own: true,
    supports: { heart: 0, hug: 0, support: 0 },
  },
  {
    author: "Calm Cottontail",
    avatarSrc: "/demo-bunnies/bunny-4.png",
    accentColor: "#efe0d0",
    time: "9:26 AM",
    body: "Same. If I make it tiny enough, I usually do it. Five minutes still changes the day.",
    own: false,
    supports: { heart: 1, hug: 0, support: 1 },
  },
];

const memberStatuses = [
  { author: "Silver Cottontail", mentionAlias: "SilverBunny", src: "/demo-bunnies/bunny-1.png" },
  { author: "Gentle Cottontail", mentionAlias: "GentleBunny", src: "/demo-bunnies/bunny-3.png" },
  { author: "Brave Cottontail", mentionAlias: "BraveBunny", src: "/demo-bunnies/bunny-6.png" },
  { author: "Open Cottontail", mentionAlias: "OpenBunny", src: "/demo-bunnies/bunny-5.png" },
  { author: "Calm Cottontail", mentionAlias: "CalmBunny", src: "/demo-bunnies/bunny-4.png" },
  { author: "You", mentionAlias: "You", src: "/demo-bunnies/bunny-2.png" },
] as const;

const mentionDirectory = new Map([
  ["silverbunny", "SilverBunny"],
  ["gentlebunny", "GentleBunny"],
  ["bravebunny", "BraveBunny"],
  ["openbunny", "OpenBunny"],
  ["calmbunny", "CalmBunny"],
]);

const DEMO_STORAGE_KEY = "cardiobunny-demo-circle-v2";

function getInitialDemoState() {
  if (typeof window === "undefined") {
    return {
      messages: initialMessages,
      reacted: {} as Record<string, SupportState>,
    };
  }

  try {
    const raw = window.localStorage.getItem(DEMO_STORAGE_KEY);

    if (!raw) {
      return {
        messages: initialMessages,
        reacted: {} as Record<string, SupportState>,
      };
    }

    const parsed = JSON.parse(raw) as {
      messages?: DemoMessage[];
      reacted?: Record<string, SupportState>;
    };

    return {
      messages: parsed.messages?.length ? parsed.messages : initialMessages,
      reacted: parsed.reacted ?? {},
    };
  } catch {
    return {
      messages: initialMessages,
      reacted: {} as Record<string, SupportState>,
    };
  }
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function bubbleStyle(accentColor: string, own: boolean) {
  const { r, g, b } = hexToRgb(accentColor);

  if (own) {
    return {
      background: `linear-gradient(180deg, rgba(${r}, ${g}, ${b}, 0.96), rgba(${r}, ${g}, ${b}, 0.88))`,
    };
  }

  return {
    background: `linear-gradient(180deg, rgba(${r}, ${g}, ${b}, 0.98), rgba(${r}, ${g}, ${b}, 0.92))`,
  };
}

function getTimeLabel() {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());
}

function renderMessageWithMentions(body: string) {
  const parts = body.split(/(@[A-Za-z][A-Za-z0-9_-]*)/g);

  return parts.map((part, index) => {
    if (!part.startsWith("@")) {
      return <span key={`${part}-${index}`}>{part}</span>;
    }

    const normalized = part.slice(1).toLowerCase();
    const label = mentionDirectory.get(normalized);

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

export function CircleDemoClient() {
  const [messages, setMessages] = useState(() => getInitialDemoState().messages);
  const [draft, setDraft] = useState("");
  const [reacted, setReacted] = useState<Record<string, SupportState>>(
    () => getInitialDemoState().reacted
  );
  const [replyToIndex, setReplyToIndex] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    window.localStorage.setItem(
      DEMO_STORAGE_KEY,
      JSON.stringify({
        messages,
        reacted,
      })
    );
  }, [messages, reacted]);

  function handleMentionClick(mentionAlias: string) {
    const field = textareaRef.current;

    if (!field) {
      return;
    }

    const trimmed = field.value.replace(/\s+$/, "");
    const nextValue = trimmed ? `${trimmed} @${mentionAlias} ` : `@${mentionAlias} `;
    field.value = nextValue;
    setDraft(nextValue);
    field.focus();
    const end = nextValue.length;
    field.setSelectionRange(end, end);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = draft.trim();

    if (!trimmed) {
      return;
    }

    const replyTarget = replyToIndex !== null ? messages[replyToIndex] : null;

    setMessages((current) => [
      ...current,
      {
        author: "You",
        avatarSrc: "/demo-bunnies/bunny-2.png",
        accentColor: "#e0c070",
        body: trimmed,
        own: true,
        replyTo: replyTarget
          ? {
              author: replyTarget.author,
              body: replyTarget.body,
            }
          : undefined,
        supports: { heart: 0, hug: 0, support: 0 },
        time: getTimeLabel(),
      },
    ]);
    setDraft("");
    setReplyToIndex(null);
  }

  function handleSupport(messageIndex: number, kind: keyof SupportCounts) {
    const messageKey = `${messageIndex}`;
    const hasReacted = reacted[messageKey]?.[kind] ?? false;

    setMessages((current) =>
      current.map((message, index) =>
        index === messageIndex
          ? {
              ...message,
              supports: {
                ...message.supports,
                [kind]: Math.max(0, message.supports[kind] + (hasReacted ? -1 : 1)),
              },
            }
          : message
      )
    );

    setReacted((current) => ({
      ...current,
      [messageKey]: {
        heart: current[messageKey]?.heart ?? false,
        hug: current[messageKey]?.hug ?? false,
        support: current[messageKey]?.support ?? false,
        [kind]: !hasReacted,
      },
    }));
  }

  function handleReply(messageIndex: number) {
    setReplyToIndex(messageIndex);
    textareaRef.current?.focus();
  }

  function handleResetDemo() {
    setMessages(initialMessages);
    setReacted({});
    setDraft("");
    setReplyToIndex(null);
    window.localStorage.removeItem(DEMO_STORAGE_KEY);
  }

  const seenTodayAuthors = new Set(messages.map((message) => message.author));
  const replyTarget = replyToIndex !== null ? messages[replyToIndex] : null;

  return (
    <main className="cb-entry-page">
      <section className="circle-demo-shell">
        <div className="circle-demo-phone">
          <header className="circle-demo-topbar">
            <Link aria-label="Back" className="circle-demo-iconbutton" href="/">
              <span aria-hidden="true">Back</span>
            </Link>

            <div className="circle-demo-heading">
              <p className="circle-demo-brand">Cardio Bunny</p>
              <h1>Your Circle</h1>
              <p>4 of 6 checked in today</p>
            </div>

            <Link aria-label="Settings" className="circle-demo-iconbutton" href="/settings">
              <span aria-hidden="true">Menu</span>
            </Link>
          </header>

          <div className="circle-demo-utility">
            <button className="circle-demo-reset button-reset" onClick={handleResetDemo} type="button">
              Reset demo
            </button>
          </div>

          <div className="circle-demo-members" aria-label="Circle members">
            {memberStatuses.map((member) => (
              <span
                className={`circle-demo-member ${seenTodayAuthors.has(member.author) ? "circle-demo-member-active" : ""}`}
                key={member.author}
              >
                <Image alt="" className="circle-demo-member-image" height={28} src={member.src} width={28} />
              </span>
            ))}
          </div>

          <section className="circle-demo-pinned">
            <p className="circle-demo-pinned-label">This week</p>
            <p className="circle-demo-pinned-copy">Keep moving gently. Small counts.</p>
          </section>

          <section className="circle-demo-feed" aria-label="Circle conversation">
            {messages.map((message, index) => (
              <article
                className={`circle-demo-message-row ${message.own ? "circle-demo-message-row-own" : ""}`}
                key={`${message.author}-${message.time}-${index}`}
              >
                {!message.own ? (
                  <span aria-hidden="true" className="circle-demo-avatar">
                    <Image alt="" className="circle-demo-avatar-image" height={28} src={message.avatarSrc} width={28} />
                  </span>
                ) : null}

                <div className="circle-demo-message-stack">
                  {!message.own ? <p className="circle-demo-name">{message.author}</p> : null}

                  <div
                    className={`circle-demo-bubble ${message.own ? "circle-demo-bubble-own" : ""}`}
                    style={bubbleStyle(message.accentColor, message.own)}
                  >
                    {message.replyTo ? (
                      <div className="circle-demo-reply-preview">
                        <p className="circle-demo-reply-author">{message.replyTo.author}</p>
                        <p className="circle-demo-reply-copy">{message.replyTo.body}</p>
                      </div>
                    ) : null}
                    <p className="circle-demo-bubble-copy">{renderMessageWithMentions(message.body)}</p>
                  </div>

                  <p className="circle-demo-time">{message.time}</p>

                  <div className="circle-support-row">
                    <button
                      className="circle-support-pill button-reset"
                      onClick={() => handleReply(index)}
                      type="button"
                    >
                      <span className="circle-support-pill-label">Reply</span>
                    </button>
                    {(["heart", "hug", "support"] as const).map((kind) => (
                      <button
                        className={`circle-support-pill button-reset ${
                          reacted[`${index}`]?.[kind] ? "circle-support-pill-active" : ""
                        }`}
                        key={`${index}-${kind}`}
                        onClick={() => handleSupport(index, kind)}
                        type="button"
                      >
                        <span className="circle-support-pill-label">
                          {kind === "heart" ? "Heart" : kind === "hug" ? "Hug" : "Support"}
                        </span>
                        <span className="circle-support-pill-count">{message.supports[kind]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </section>

          <section className="circle-demo-composer">
            <p className="circle-demo-prompt">What&apos;s the smallest promise you can honestly keep today?</p>

            {replyTarget ? (
              <div className="circle-demo-replying">
                <div>
                  <p className="circle-demo-replying-label">Replying to {replyTarget.author}</p>
                  <p className="circle-demo-replying-copy">{replyTarget.body}</p>
                </div>
                <button
                  className="circle-demo-reset button-reset"
                  onClick={() => setReplyToIndex(null)}
                  type="button"
                >
                  Clear
                </button>
              </div>
            ) : null}

            <div className="circle-mention-strip" aria-label="Mention a circle member">
              {memberStatuses
                .filter((member) => member.mentionAlias !== "You")
                .map((member) => (
                  <button
                    className="circle-mention-chip button-reset"
                    key={member.mentionAlias}
                    onClick={() => handleMentionClick(member.mentionAlias)}
                    type="button"
                  >
                    @{member.mentionAlias}
                  </button>
                ))}
            </div>

            <form className="circle-demo-composer-row" onSubmit={handleSubmit}>
              <textarea
                className="circle-demo-input"
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Share something small..."
                ref={textareaRef}
                rows={1}
                value={draft}
              />
              <button aria-label="Send" className="circle-demo-send" type="submit">
                <span aria-hidden="true">Send</span>
              </button>
            </form>
          </section>
        </div>
      </section>
    </main>
  );
}
