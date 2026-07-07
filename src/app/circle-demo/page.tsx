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
            <div className="circle-room-context circle-room-context-compact">
              <h1 className="circle-room-title">Your Circle</h1>
              <p className="circle-room-day">Tuesday</p>
              <p className="circle-room-status">4 of 6 shared</p>
            </div>
          </header>

          <section className="circle-room-panel">
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
