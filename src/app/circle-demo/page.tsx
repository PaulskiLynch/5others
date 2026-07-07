const demoMembers = [
  { name: "Silver Cottontail", initial: "S", shared: true, self: false },
  { name: "Gentle Cottontail", initial: "G", shared: true, self: false },
  { name: "Brave Cottontail", initial: "B", shared: false, self: false },
  { name: "Open Cottontail", initial: "O", shared: true, self: false },
  { name: "Calm Cottontail", initial: "C", shared: false, self: false },
  { name: "You", initial: "Y", shared: true, self: true },
];

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
          <header className="circle-room-header">
            <span className="circle-header-link">← Back</span>
            <div className="circle-room-context circle-room-context-compact">
              <h1 className="circle-room-title">Your Circle</h1>
              <div className="circle-room-meta">
                <span>Day 3 of 7</span>
                <span>4/6 checked in today</span>
              </div>
            </div>
            <span className="circle-settings-link">⚙ Settings</span>
          </header>

          <section className="circle-room-panel">
            <div className="circle-member-strip" aria-label="Circle members">
              {demoMembers.map((member) => (
                <div className="circle-member-pill" key={member.name} title={member.name}>
                  <span
                    className={`circle-member-avatar ${
                      member.self
                        ? "circle-member-avatar-self"
                        : member.shared
                          ? "circle-member-avatar-posted"
                          : "circle-member-avatar-quiet"
                    }`}
                    aria-hidden="true"
                  >
                    {member.initial}
                  </span>
                  <span className="circle-member-pill-label">{member.self ? "You" : member.initial}</span>
                </div>
              ))}
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
                <p className="circle-composer-kicker">Today&apos;s check-in</p>
                <h2>What&apos;s the smallest promise you can honestly keep today?</h2>
              </div>

              <form className="composer-form circle-composer-form circle-composer-form-inline">
                <textarea
                  className="composer-textarea circle-journal-textarea"
                  placeholder="Share something small..."
                  rows={2}
                  readOnly
                />
                <button className="cb-submit button-reset circle-share-button circle-share-button-inline" type="button">
                  <span>Send</span>
                </button>
              </form>
            </section>
          </section>
        </div>
      </section>
    </main>
  );
}
