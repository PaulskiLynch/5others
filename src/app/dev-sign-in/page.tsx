import { redirect } from "next/navigation";

import { isLocalDevAuthEnabled } from "@/lib/auth";

import { startDeveloperSession } from "./actions";

type DevSignInPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function DevSignInPage({ searchParams }: DevSignInPageProps) {
  if (!isLocalDevAuthEnabled()) {
    redirect("/sign-in");
  }

  const { next } = await searchParams;

  return (
    <main className="page-shell">
      <section className="panel panel-form">
        <div className="split-head">
          <div>
            <p className="section-label">Local Developer Access</p>
            <h1 className="page-title">Enter the circle without waiting on email.</h1>
          </div>
          <p className="supporting-copy">
            This is a local-only shortcut for development. It sets a dev auth cookie so
            protected pages can be tested without burning magic-link sends.
          </p>
        </div>

        <form action={startDeveloperSession} className="intake-form">
          <input name="next" type="hidden" value={next ?? "/my-circle"} />

          <label className="field">
            <span>Developer email</span>
            <input
              name="email"
              type="email"
              defaultValue="paullynch.ie@gmail.com"
              placeholder="you@example.com"
              required
            />
          </label>

          <div className="cta-row">
            <button className="primary-cta button-reset" type="submit">
              Start local session
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
