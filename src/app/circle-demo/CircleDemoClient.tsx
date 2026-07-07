"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type DemoMessage = {
  accentColor: string;
  author: string;
  avatarSrc: string;
  body: string;
  own: boolean;
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
  },
  {
    author: "Gentle Cottontail",
    avatarSrc: "/demo-bunnies/bunny-3.png",
    accentColor: "#f1d9d8",
    time: "9:17 AM",
    body: "That absolutely counts. I am beginning again too.",
    own: false,
  },
  {
    author: "Brave Cottontail",
    avatarSrc: "/demo-bunnies/bunny-6.png",
    accentColor: "#f2e3c9",
    time: "9:19 AM",
    body: "Water first, shoes on second. What is the smallest version of the walk you can do today?",
    own: false,
  },
  {
    author: "Open Cottontail",
    avatarSrc: "/demo-bunnies/bunny-5.png",
    accentColor: "#d4e3d5",
    time: "9:22 AM",
    body: "Mine is just to get outside before lunch. I keep overthinking it when I stay indoors.",
    own: false,
  },
  {
    author: "You",
    avatarSrc: "/demo-bunnies/bunny-2.png",
    accentColor: "#e0c070",
    time: "9:24 AM",
    body: "Mine is simply shoes on. No promises beyond that.",
    own: true,
  },
  {
    author: "Calm Cottontail",
    avatarSrc: "/demo-bunnies/bunny-4.png",
    accentColor: "#efe0d0",
    time: "9:26 AM",
    body: "Same. If I make it tiny enough, I usually do it. Five minutes still changes the day.",
    own: false,
  },
];

const memberStatuses = [
  { active: true, src: "/demo-bunnies/bunny-1.png" },
  { active: true, src: "/demo-bunnies/bunny-3.png" },
  { active: true, src: "/demo-bunnies/bunny-6.png" },
  { active: true, src: "/demo-bunnies/bunny-5.png" },
  { active: false, src: "/demo-bunnies/bunny-4.png" },
  { active: true, src: "/demo-bunnies/bunny-2.png" },
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
        avatarSrc: "/demo-bunnies/bunny-2.png",
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
                  key={`${member.src}-${member.active ? "on" : "off"}`}
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
                  <span
                    aria-hidden="true"
                    className="circle-demo-avatar"
                  >
                    <Image alt="" className="circle-demo-avatar-image" height={28} src={message.avatarSrc} width={28} />
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
