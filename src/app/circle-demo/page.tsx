import { generateWeeklyPseudonym } from "@/lib/pseudonyms";

const demoMembers = [
  generateWeeklyPseudonym("circle-a"),
  generateWeeklyPseudonym("circle-b"),
  generateWeeklyPseudonym("circle-c"),
  generateWeeklyPseudonym("circle-d"),
  generateWeeklyPseudonym("circle-e"),
  generateWeeklyPseudonym("circle-f"),
];

const bubbles = [
  {
    author: demoMembers[0],
    style: "blush",
    time: "9:15 AM",
    body: "I restarted my morning walk today. Only twelve minutes, but it counted."
  },
  {
    author: demoMembers[3],
    style: "porcelain",
    time: "9:16 AM",
    body: "That counts. A restart is still movement. I am beginning again today too."
  },
  {
    author: demoMembers[5],
    style: "porcelain",
    time: "9:17 AM",
    body: "Water first, shoes on second. What's the smallest version of the walk you can do today?"
  },
  {
    author: demoMembers[1],
    style: "blush",
    time: "9:22 AM",
    body: "Mine is just to get outside before lunch. I keep overthinking it when I stay indoors."
  },
  {
    author: demoMembers[4],
    style: "porcelain",
    time: "9:26 AM",
    body: "Same. If I make it tiny enough, I usually do it. Five minutes still changes the day."
  },
];

export default function CircleDemoPage() {
  return (
    <main className="page-shell">
      <section className="circle-stage circle-stage-dark">
        <div className="circle-reference-layout">
          <div className="phone-shell">
            <div className="phone-topbar">
              <span className="phone-back">&lt;</span>
              <div className="phone-heading">
                <strong>Week 29 Circle</strong>
                <span>6 anonymous bunnies, fitness focus</span>
              </div>
              <span className="phone-menu">...</span>
            </div>

            <div className="avatar-strip">
              {demoMembers.map((member, index) => (
                <div className="avatar-token" key={member.pseudonym}>
                  <div
                    className="avatar-core"
                    style={{ background: `linear-gradient(180deg, ${member.accentColor}, #ffe9dd)` }}
                  >
                    <span>{member.pseudonym.split(" ").map((part) => part[0]).join("")}</span>
                  </div>
                  <small>B{index + 1}</small>
                </div>
              ))}
            </div>

            <div className="bubble-stack">
              {bubbles.map((bubble, index) => (
                <article
                  className={`chat-bubble chat-bubble-${bubble.style} ${
                    index === 0 ? "chat-bubble-self" : "chat-bubble-peer"
                  }`}
                  key={`${bubble.author.pseudonym}-${bubble.time}`}
                >
                  {index > 0 ? <p className="chat-author">{bubble.author.pseudonym}</p> : null}
                  <p className="chat-body">{bubble.body}</p>
                  <div className="chat-meta">
                    <span>{bubble.time}</span>
                    <span className="chat-soft-tag">encouragement only</span>
                  </div>
                </article>
              ))}
            </div>

            <div className="composer-shell">
              <div className="composer-input">Share a small win, wobble, or reset...</div>
              <button className="composer-send button-reset" type="button">
                ^
              </button>
            </div>

            <div className="support-banner">
              <div className="support-icon">O</div>
              <p>Six women trying to keep one promise to themselves this week.</p>
            </div>
          </div>

          <div className="circle-reference-copy">
            <p className="section-label">Sample Tuesday</p>
            <h1 className="page-title">A real circle should sound specific, gentle, and useful.</h1>
            <p className="lede circle-lede dark-lede">
              The room works when the copy feels lived-in. Not inspirational poster
              language. Not therapy-speak. Just women telling the truth about how the
              week is actually going and helping each other continue.
            </p>

            <div className="reference-notes">
              <div className="reference-note">
                <span className="reference-number">01</span>
                <p>
                  Good sample posts are concrete. &quot;Twelve minutes&quot; is stronger than
                  &quot;I am making progress.&quot;
                </p>
              </div>
              <div className="reference-note">
                <span className="reference-number">02</span>
                <p>
                  The tone should lower pressure, not raise it. Members help each
                  other shrink the task until it becomes possible.
                </p>
              </div>
              <div className="reference-note">
                <span className="reference-number">03</span>
                <p>
                  The best encouragement is companionship, not applause. No praise
                  loops, no scorekeeping, no performing resilience.
                </p>
              </div>
            </div>

            <div className="dark-panel">
              <p className="section-label">Closing ritual preview</p>
              <blockquote>
                &quot;If the week goes sideways, leave one sentence that helps someone else
                come back next Monday anyway.&quot;
              </blockquote>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
