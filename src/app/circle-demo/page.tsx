const demoMessages = [
  {
    author: "Silver Cottontail",
    time: "9:15 AM",
    body: "I restarted my morning walk today.\n\nOnly twelve minutes but it counted.",
    own: false,
    grouped: false,
  },
  {
    author: "Gentle Cottontail",
    time: "9:16 AM",
    body: "That absolutely counts.\n\nI'm beginning again too.",
    own: false,
    grouped: true,
  },
  {
    author: "You",
    time: "9:22 AM",
    body: "Mine is simply shoes on.\n\nNo promises beyond that.",
    own: true,
    grouped: false,
  },
  {
    author: "Open Cottontail",
    time: "9:24 AM",
    body: "That feels like enough for today. Outside is usually the hardest part for me too.",
    own: false,
    grouped: false,
  },
];

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
                <span className="circle-menu-link">Previous Circles</span>
                <span className="circle-menu-link">Archive</span>
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
                    <span className="circle-chat-avatar" aria-hidden="true">
                      {message.author.slice(0, 1)}
                    </span>
                  ) : null}
                  <div className={`circle-note ${message.own ? "circle-note-own" : "circle-note-peer"}`}>
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
                  readOnly
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
