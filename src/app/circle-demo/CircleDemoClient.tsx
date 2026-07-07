"use client";

import Link from "next/link";
import { useState } from "react";

type DemoMessage = {
  accentColor: string;
  author: string;
  body: string;
  own: boolean;
  time: string;
};

const initialMessages: DemoMessage[] = [
  {
    author: "Silver Cottontail",
    accentColor: "#e7d6b5",
    time: "9:15 AM",
    body: "I restarted my morning walk today. Only twelve minutes, but it counted.",
    own: false,
  },
  {
    author: "Gentle Cottontail",
    accentColor: "#f1d9d8",
    time: "9:17 AM",
    body: "That absolutely counts. I am beginning again too.",
    own: false,
  },
  {
    author: "Brave Cottontail",
    accentColor: "#f2e3c9",
    time: "9:19 AM",
    body: "Water first, shoes on second. What is the smallest version of the walk you can do today?",
    own: false,
  },
  {
    author: "Open Cottontail",
    accentColor: "#d4e3d5",
    time: "9:22 AM",
    body: "Mine is just to get outside before lunch. I keep overthinking it when I stay indoors.",
    own: false,
  },
  {
    author: "You",
    accentColor: "#e0c070",
    time: "9:24 AM",
    body: "Mine is simply shoes on. No promises beyond that.",
    own: true,
  },
  {
    author: "Calm Cottontail",
    accentColor: "#efe0d0",
    time: "9:26 AM",
    body: "Same. If I make it tiny enough, I usually do it. Five minutes still changes the day.",
    own: false,
  },
];

const memberStatuses = [
  { active: true, tone: "#e7d6b5" },
  { active: true, tone: "#f1d9d8" },
  { active: true, tone: "#f2e3c9" },
  { active: true, tone: "#d4e3d5" },
  { active: false, tone: "#d9d1ca" },
  { active: true, tone: "#e0c070" },
] as const;

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function avatarStyle(accentColor: string) {
  const { r, g, b } = hexToRgb(accentColor);

  return {
    background: `rgb(${r} ${g} ${b})`,
    color: `rgb(${Math.max(38, r - 110)} ${Math.max(28, g - 110)} ${Math.max(24, b - 110)})`,
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

export function CircleDemoClient() {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = draft.trim();

    if (!trimmed) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        author: "You",
        accentColor: "#e0c070",
        body: trimmed,
        own: true,
        time: getTimeLabel(),
      },
    ]);
    setDraft("");
  }

  return (
    <main className="cb-entry-page">
      <section className="circle-demo-shell">
        <div className="circle-demo-phone">
          <header className="circle-demo-topbar">
            <Link aria-label="Back" className="circle-demo-iconbutton" href="/">
              <span aria-hidden="true">‹</span>
            </Link>

            <div className="circle-demo-heading">
              <p className="circle-demo-brand">Cardio Bunny</p>
              <h1>Your Circle</h1>
              <p>4 of 6 checked in today</p>
            </div>

            <Link aria-label="Settings" className="circle-demo-iconbutton" href="/settings">
              <span aria-hidden="true">⋯</span>
            </Link>
          </header>

            <div className="circle-demo-members" aria-label="Circle members">
              {memberStatuses.map((member) => (
                <span
                  className={`circle-demo-member ${member.active ? "circle-demo-member-active" : ""}`}
                  key={`${member.tone}-${member.active ? "on" : "off"}`}
                  style={{ backgroundColor: member.tone }}
                >
                  <span className="circle-demo-bunny-ears" />
                  <span className="circle-demo-bunny-face" />
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
                  <span
                    aria-hidden="true"
                    className="circle-demo-avatar"
                    style={avatarStyle(message.accentColor)}
                  >
                    <span className="circle-demo-bunny-ears" />
                    <span className="circle-demo-bunny-face" />
                  </span>
                ) : null}

                <div className="circle-demo-message-stack">
                  {!message.own ? <p className="circle-demo-name">{message.author}</p> : null}

                  <div
                    className={`circle-demo-bubble ${message.own ? "circle-demo-bubble-own" : ""}`}
                    style={bubbleStyle(message.accentColor, message.own)}
                  >
                    <p className="circle-demo-bubble-copy">{message.body}</p>
                  </div>

                  <p className="circle-demo-time">{message.time}</p>
                </div>
              </article>
            ))}
          </section>

          <section className="circle-demo-composer">
            <p className="circle-demo-prompt">What&apos;s the smallest promise you can honestly keep today?</p>

            <form className="circle-demo-composer-row" onSubmit={handleSubmit}>
              <textarea
                className="circle-demo-input"
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Share something small..."
                rows={1}
                value={draft}
              />
              <button aria-label="Send" className="circle-demo-send" type="submit">
                <span aria-hidden="true">➜</span>
              </button>
            </form>
          </section>
        </div>
      </section>
    </main>
  );
}
