const demoMembers = [
  { name: "Silver Cottontail", initial: "S", shared: true },
  { name: "Gentle Cottontail", initial: "G", shared: true },
  { name: "Brave Cottontail", initial: "B", shared: true },
  { name: "Open Cottontail", initial: "O", shared: true },
  { name: "Calm Cottontail", initial: "C", shared: false },
  { name: "You", initial: "Y", shared: false },
];

const demoMessages = [
  {
    author: "Silver Cottontail",
    time: "9:15 AM",
    body: "I restarted my morning walk today. Only twelve minutes, but it counted.",
  },
  {
    author: "Gentle Cottontail",
    time: "9:16 AM",
    body: "That counts. A restart is still movement. I’m beginning again today too.",
  },
  {
    author: "Brave Cottontail",
    time: "9:17 AM",
    body: "Water first, shoes on second. What’s the smallest version of the walk you can do today?",
  },
  {
    author: "Open Cottontail",
    time: "9:22 AM",
    body: "Mine is just to get outside before lunch. I keep overthinking it when I stay indoors.",
  },
  {
    author: "Calm Cottontail",
    time: "9:26 AM",
    body: "Same. If I make it tiny enough, I usually do it. Five minutes still changes the day.",
  },
];

export default function CircleDemoPage() {
  return (
    <main className="cb-entry-page">
      <section className="circle-focus-shell">
        <div className="circle-room-shell">
          <header className="circle-room-header">
            <div className="circle-room-context">
              <p className="circle-room-kicker">Your Circle</p>
              <h1 className="circle-room-title">July 14-20</h1>
              <p className="circle-room-subtitle">4 of 6 have shared today</p>
            </div>
          </header>

          <section className="circle-room-panel">
            <div className="circle-member-list">
              {demoMembers.map((member) => (
                <div className="circle-member-row" key={member.name}>
                  <div className="circle-member-namewrap">
                    <span className="circle-member-bunny" aria-hidden="true">
                      {member.initial}
                    </span>
                    <span className="circle-member-name">{member.name}</span>
                  </div>
                  <span
                    className={`circle-member-status ${
                      member.shared ? "circle-member-status-posted" : "circle-member-status-quiet"
                    }`}
                  >
                    {member.shared ? "shared" : "quiet today"}
                  </span>
                </div>
              ))}
            </div>

            <section className="circle-composer-card">
              <div className="circle-composer-head">
                <h2>What&apos;s the smallest version of your walk today?</h2>
              </div>
              <form className="composer-form circle-composer-form">
                <textarea
                  className="composer-textarea circle-journal-textarea"
                  placeholder="Share something small..."
                  rows={4}
                  readOnly
                />
                <button className="cb-submit button-reset circle-share-button" type="button">
                  <span>Send</span>
                </button>
              </form>
            </section>

            <div className="circle-feed">
              {demoMessages.map((message) => (
                <article className="circle-note" key={`${message.author}-${message.time}`}>
                  <div className="circle-note-head">
                    <p className="circle-note-author">
                      {message.author} <span className="circle-note-separator">·</span> {message.time}
                    </p>
                  </div>
                  <p className="circle-note-body">{message.body}</p>
                </article>
              ))}
            </div>

            <footer className="circle-status-strip">
              <span>4 of 6 have shared today</span>
              <span>Circle closes Sunday night</span>
            </footer>
          </section>
        </div>
      </section>
    </main>
  );
}
