const demoMessages = [
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
  const full = normalized.length === 3
    ? normalized.split("").map((value) => `${value}${value}`).join("")
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

export default function CircleDemoPage() {
  return (
    <main className="cb-entry-page">
      <section className="circle-focus-shell">
        <div className="circle-room-shell">
          <div className="circle-topbar">
            <details className="circle-menu">
              <summary className="circle-topbar-button">☰</summary>
              <div className="circle-menu-panel">
                <span className="circle-menu-link">Your Circle</span>
                <span className="circle-menu-link">Circle Members</span>
                <span className="circle-menu-link">Settings</span>
                <span className="circle-menu-link">Help</span>
                <span className="circle-menu-link">Log out</span>
              </div>
            </details>

            <p className="circle-topbar-brand">Cardio Bunny</p>
            <span className="circle-topbar-button circle-topbar-settings">⚙</span>
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
              {demoMessages.map((message) => (
                <article
                  className={`circle-chat-row ${message.own ? "circle-chat-row-own" : "circle-chat-row-peer"} ${
                    message.grouped ? "circle-chat-row-grouped" : ""
                  }`}
                  key={`${message.author}-${message.time}`}
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

              <form className="composer-form circle-composer-form circle-composer-form-inline">
                <textarea
                  className="composer-textarea circle-journal-textarea"
                  placeholder="Share something small..."
                  rows={1}
                />
                <button
                  aria-label="Send"
                  className="cb-submit button-reset circle-share-button circle-share-button-inline"
                  type="button"
                >
                  <span>➜</span>
                </button>
              </form>
            </section>
          </section>
        </div>
      </section>
    </main>
  );
}
