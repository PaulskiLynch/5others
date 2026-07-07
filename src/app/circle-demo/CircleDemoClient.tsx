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
  { author: "Silver Cottontail", src: "/demo-bunnies/bunny-1.png" },
  { author: "Gentle Cottontail", src: "/demo-bunnies/bunny-3.png" },
  { author: "Brave Cottontail", src: "/demo-bunnies/bunny-6.png" },
  { author: "Open Cottontail", src: "/demo-bunnies/bunny-5.png" },
  { author: "Calm Cottontail", src: "/demo-bunnies/bunny-4.png" },
  { author: "You", src: "/demo-bunnies/bunny-2.png" },
] as const;

const activeTodayAuthors = new Set(memberStatuses.map((member) => member.author));

const mentionDirectory = new Map([
  ["silverbunny", "SilverBunny"],
  ["gentlebunny", "GentleBunny"],
  ["bravebunny", "BraveBunny"],
  ["openbunny", "OpenBunny"],
  ["calmbunny", "CalmBunny"],
]);

const DEMO_STORAGE_KEY = "cardiobunny-demo-circle-v3";

function persistDemoState(messages: DemoMessage[], reacted: Record<string, SupportState>) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    DEMO_STORAGE_KEY,
    JSON.stringify({
      messages,
      reacted,
    })
  );
}

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
  const [mentionQuery, setMentionQuery] = useState("");
  const [showMentionMenu, setShowMentionMenu] = useState(false);
  const feedEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    persistDemoState(messages, reacted);
  }, [messages, reacted]);

  useEffect(() => {
    window.requestAnimationFrame(() => {
      feedEndRef.current?.scrollIntoView({ block: "end" });
    });
  }, [messages.length]);

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key !== DEMO_STORAGE_KEY || !event.newValue) {
        return;
      }

      try {
        const parsed = JSON.parse(event.newValue) as {
          messages?: DemoMessage[];
          reacted?: Record<string, SupportState>;
        };

        if (parsed.messages?.length) {
          setMessages(parsed.messages);
        }

        setReacted(parsed.reacted ?? {});
      } catch {}
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = draft.trim();

    if (!trimmed) {
      return;
    }

    const replyTarget = replyToIndex !== null ? messages[replyToIndex] : null;

    const nextMessages = [
      ...messages,
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
    ];

    setMessages(nextMessages);
    persistDemoState(nextMessages, reacted);
    setDraft("");
    setReplyToIndex(null);
    setMentionQuery("");
    setShowMentionMenu(false);
  }

  function handleSupport(messageIndex: number, kind: keyof SupportCounts) {
    const messageKey = `${messageIndex}`;
    const hasReacted = reacted[messageKey]?.[kind] ?? false;

    const nextMessages = messages.map((message, index) =>
      index === messageIndex
        ? {
            ...message,
            supports: {
              ...message.supports,
              [kind]: Math.max(0, message.supports[kind] + (hasReacted ? -1 : 1)),
            },
          }
        : message
    );

    const nextReacted = {
      ...reacted,
      [messageKey]: {
        heart: reacted[messageKey]?.heart ?? false,
        hug: reacted[messageKey]?.hug ?? false,
        support: reacted[messageKey]?.support ?? false,
        [kind]: !hasReacted,
      },
    };

    setMessages(nextMessages);
    setReacted(nextReacted);
    persistDemoState(nextMessages, nextReacted);
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
    setMentionQuery("");
    setShowMentionMenu(false);
    persistDemoState(initialMessages, {});
    window.localStorage.removeItem(DEMO_STORAGE_KEY);
  }

  function updateMentionState(value: string, caretPosition?: number | null) {
    const safeCaret = caretPosition ?? value.length;
    const beforeCaret = value.slice(0, safeCaret);
    const mentionMatch = beforeCaret.match(/(^|\s)@([A-Za-z0-9_-]*)$/);

    if (!mentionMatch) {
      setMentionQuery("");
      setShowMentionMenu(false);
      return;
    }

    setMentionQuery(mentionMatch[2] ?? "");
    setShowMentionMenu(true);
  }

  function insertMention(mentionAlias: string) {
    const field = textareaRef.current;

    if (!field) {
      return;
    }

    const start = field.selectionStart ?? field.value.length;
    const end = field.selectionEnd ?? field.value.length;
    const before = field.value.slice(0, start).replace(/(^|\s)@([A-Za-z0-9_-]*)$/, "$1");
    const after = field.value.slice(end);
    const nextValue = `${before}@${mentionAlias} ${after}`;

    setDraft(nextValue);
    setMentionQuery("");
    setShowMentionMenu(false);

    window.requestAnimationFrame(() => {
      field.focus();
      const nextCaret = before.length + mentionAlias.length + 2;
      field.setSelectionRange(nextCaret, nextCaret);
    });
  }

  function handleDraftChange(value: string, caretPosition?: number | null) {
    setDraft(value);
    updateMentionState(value, caretPosition);
  }

  function handleComposerKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (draft.trim()) {
        event.currentTarget.form?.requestSubmit();
      }
      return;
    }

    if (event.key === "Escape") {
      setShowMentionMenu(false);
      setMentionQuery("");
    }
  }

  const seenTodayAuthors = new Set(messages.map((message) => message.author));
  const replyTarget = replyToIndex !== null ? messages[replyToIndex] : null;
  const mentionSuggestions = Array.from(mentionDirectory.values()).filter((alias) =>
    alias.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  return (
    <main className="cb-entry-page">
      <section className="circle-demo-shell">
        <div className="circle-demo-phone">
          <header className="circle-demo-topbar">
            <Link aria-label="Back" className="circle-demo-iconbutton" href="/">
              <span aria-hidden="true">☰</span>
            </Link>

            <div className="circle-demo-heading">
              <p className="circle-demo-brand">Cardio Bunny</p>
              <h1>Your Circle</h1>
              <p>{seenTodayAuthors.size} of 6 checked in today</p>
            </div>

            <Link aria-label="Settings" className="circle-demo-iconbutton" href="/settings">
              <span aria-hidden="true">⚙</span>
            </Link>
          </header>

          <div className="circle-demo-members" aria-label="Circle members">
            {memberStatuses.map((member) => (
              <span
                className={`circle-demo-member ${seenTodayAuthors.has(member.author) ? "circle-demo-member-active" : ""}`}
                key={member.author}
                title={member.author}
              >
                <Image alt="" className="circle-demo-member-image" height={56} src={member.src} width={56} />
                {activeTodayAuthors.has(member.author) ? <span className="circle-demo-member-dot" /> : null}
              </span>
            ))}
          </div>

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
                    {(["heart", "hug", "support"] as const).map((kind) => (
                      <button
                        className={`circle-support-pill circle-support-pill-icon button-reset ${
                          kind === "heart"
                            ? "circle-support-pill-heart"
                            : kind === "hug"
                              ? "circle-support-pill-hug"
                              : "circle-support-pill-support"
                        } ${reacted[`${index}`]?.[kind] ? "circle-support-pill-active" : ""}`}
                        key={`${index}-${kind}`}
                        onClick={() => handleSupport(index, kind)}
                        type="button"
                      >
                        <span aria-hidden="true" className="circle-support-pill-iconmark">
                          {kind === "heart" ? "♥" : kind === "hug" ? "✦" : "✳"}
                        </span>
                        <span className="sr-only">
                          {kind === "heart" ? "Heart" : kind === "hug" ? "Hug" : "Support"}
                        </span>
                        <span className="circle-support-pill-count">{message.supports[kind]}</span>
                      </button>
                    ))}
                    <button
                      className="circle-support-pill circle-support-pill-reply button-reset"
                      onClick={() => handleReply(index)}
                      type="button"
                    >
                      <span className="circle-support-pill-label">Reply</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
            <div ref={feedEndRef} />
          </section>

          <section className="circle-demo-composer">
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

            <form className="circle-demo-composer-row" onSubmit={handleSubmit}>
              <div className="circle-demo-composer-inputwrap">
                <textarea
                  className="circle-demo-input"
                  onChange={(event) =>
                    handleDraftChange(event.target.value, event.currentTarget.selectionStart)
                  }
                  onClick={(event) =>
                    updateMentionState(event.currentTarget.value, event.currentTarget.selectionStart)
                  }
                  onKeyDown={handleComposerKeyDown}
                  placeholder="Share something small..."
                  ref={textareaRef}
                  rows={1}
                  value={draft}
                />
                {showMentionMenu && mentionSuggestions.length ? (
                  <div className="circle-demo-mentions-menu">
                    {mentionSuggestions.map((alias) => (
                      <button
                        className="circle-demo-mentions-item button-reset"
                        key={alias}
                        onClick={() => insertMention(alias)}
                        type="button"
                      >
                        @{alias}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              <button aria-label="Send" className="circle-demo-send" type="submit">
                <span aria-hidden="true">↑</span>
              </button>
            </form>

            <div className="circle-demo-footerline">
              <button className="circle-demo-reset button-reset" onClick={handleResetDemo} type="button">
                Reset demo
              </button>
              <p>Small steps. Shared strength.</p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
