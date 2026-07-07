"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type DemoMessage = {
  accentColor: string;
  author: string;
  body: string;
  grouped: boolean;
  own: boolean;
  time: string;
};

const initialMessages: DemoMessage[] = [
  {
    author: "Silver Cottontail",
    accentColor: "#D9B38C",
    time: "9:15 AM",
    body: "I restarted my morning walk today.\n\nOnly twelve minutes but it counted.",
    own: false,
    grouped: false,
  },
  {
    author: "Gentle Cottontail",
    accentColor: "#CFA1B9",
    time: "9:16 AM",
    body: "That absolutely counts.\n\nI'm beginning again too.",
    own: false,
    grouped: true,
  },
  {
    author: "You",
    accentColor: "#D9A957",
    time: "9:22 AM",
    body: "Mine is simply shoes on.\n\nNo promises beyond that.",
    own: true,
    grouped: false,
  },
  {
    author: "Open Cottontail",
    accentColor: "#9CB9A4",
    time: "9:24 AM",
    body: "That feels like enough for today. Outside is usually the hardest part for me too.",
    own: false,
    grouped: false,
  },
];

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

    const previous = messages[messages.length - 1];

    setMessages((current) => [
      ...current,
      {
        author: "You",
        accentColor: "#D9A957",
        body: trimmed,
        grouped: previous?.own ?? false,
        own: true,
        time: getTimeLabel(),
      },
    ]);
    setDraft("");
  }

  return (
    <main className="cb-entry-page">
      <section className="circle-focus-shell">
        <div className="circle-room-shell">
          <div className="circle-topbar circle-topbar-simple">
            <p className="circle-topbar-brand">Cardio Bunny</p>
          </div>

          <header className="circle-room-header">
            <div className="circle-room-context circle-room-context-compact">
              <h1 className="circle-room-title">Your Circle</h1>
              <p className="circle-room-day">Tuesday</p>
              <p className="circle-room-status">Four people have checked in. Two are still finding their moment.</p>
            </div>
          </header>

          <section className="circle-room-panel">
            <div className="circle-room-intent">
              <p className="circle-room-intent-label">This week</p>
              <p className="circle-room-intent-copy">Keep moving gently.</p>
            </div>

            <div className="circle-feed">
              {messages.map((message, index) => (
                <article
                  className={`circle-chat-row ${message.own ? "circle-chat-row-own" : "circle-chat-row-peer"} ${
                    message.grouped || (index > 0 && messages[index - 1]?.own === message.own)
                      ? "circle-chat-row-grouped"
                      : ""
                  }`}
                  key={`${message.author}-${message.time}-${index}`}
                >
                  {!message.own ? (
                    <span className="circle-chat-avatar" aria-hidden="true" style={avatarStyle(message.accentColor)}>
                      {message.author.slice(0, 1)}
                    </span>
                  ) : null}
                  <div
                    className={`circle-note ${message.own ? "circle-note-own" : "circle-note-peer"}`}
                    style={bubbleStyle(message.accentColor)}
                  >
                    <p className="circle-note-author">{message.author}</p>
                    <p className="circle-note-body">{message.body}</p>
                    <p className="circle-note-time">{message.time}</p>
                  </div>
                </article>
              ))}
            </div>

            <section className="circle-composer-card circle-composer-sticky">
              <div className="circle-composer-head">
                <h2>What&apos;s the smallest promise you can honestly keep today?</h2>
              </div>

              <form className="composer-form circle-composer-form circle-composer-form-inline" onSubmit={handleSubmit}>
                <textarea
                  className="composer-textarea circle-journal-textarea"
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Share something small..."
                  rows={1}
                  value={draft}
                />
                <button
                  aria-label="Send"
                  className="cb-submit button-reset circle-share-button circle-share-button-inline"
                  type="submit"
                >
                  <span>Go</span>
                </button>
              </form>
            </section>
          </section>

          <nav className="circle-footer-nav" aria-label="Circle footer navigation">
            <Link className="circle-footer-link circle-footer-link-active" href="/circle-demo">
              <span className="circle-footer-iconwrap" aria-hidden="true">
                <Image alt="" className="circle-footer-icon" height={22} src="/cardiobunny-love-your-heart.png" width={22} />
              </span>
              <span>My Circle</span>
            </Link>
            <Link className="circle-footer-link" href="/settings#members">
              <span className="circle-footer-iconwrap" aria-hidden="true">
                <Image alt="" className="circle-footer-icon" height={22} src="/cardiobunny-love-your-heart.png" width={22} />
              </span>
              <span>Members</span>
            </Link>
            <Link className="circle-footer-link" href="/settings">
              <span className="circle-footer-iconwrap" aria-hidden="true">
                <Image alt="" className="circle-footer-icon" height={22} src="/cardiobunny-love-your-heart.png" width={22} />
              </span>
              <span>Settings</span>
            </Link>
            <Link className="circle-footer-link" href="/sign-in">
              <span className="circle-footer-iconwrap" aria-hidden="true">
                <Image alt="" className="circle-footer-icon" height={22} src="/cardiobunny-love-your-heart.png" width={22} />
              </span>
              <span>Log Out</span>
            </Link>
          </nav>
        </div>
      </section>
    </main>
  );
}
