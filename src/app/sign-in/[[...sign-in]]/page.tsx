import Link from "next/link";
import { redirect } from "next/navigation";
import { SignIn } from "@clerk/nextjs";

import { CardioBunnyEntryShell } from "@/components/cardio-bunny/CardioBunnyEntryShell";
import { CardioBunnySignInScreen } from "@/components/cardio-bunny/CardioBunnySignInScreen";
import { getAuthenticatedUserEmail, isLocalDevAuthEnabled } from "@/lib/auth";
import { getRequestBrandKey } from "@/lib/brand";
import { hasPilotIntakeRequest } from "@/lib/intake";
import { isSafeInternalPath, withNext } from "@/lib/navigation";

type SignInPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { error, next } = await searchParams;
  const brand = await getRequestBrandKey();
  const showDevAccess = isLocalDevAuthEnabled();
  const destination = next && isSafeInternalPath(next) ? next : "/my-circle";
  const handoff = withNext("/continue", destination);
  const signUpUrl = withNext("/sign-up", destination);
  const authenticatedEmail = await getAuthenticatedUserEmail();

  if (authenticatedEmail) {
    if (destination.startsWith("/admin") && error === "admin_only") {
      if (brand === "cardiobunny") {
        return (
          <CardioBunnyEntryShell
            cardSubtitle="This signed-in account is not approved for the private admin area."
            cardTitle="Admin access only"
          >
            <p className="error-banner cb-error-banner">
              This account is not on the admin allowlist yet. Add it to `ADMIN_EMAILS` in Vercel,
              or sign in with an approved admin email.
            </p>
            <div className="cta-row">
              <Link className="cb-submit button-reset cb-waiting-cta" href="/">
                <span>Return to homepage</span>
              </Link>
            </div>
          </CardioBunnyEntryShell>
        );
      }

      return (
        <main className="page-shell">
          <section className="panel panel-form">
            <div className="split-head">
              <div>
                <p className="section-label">Admin Access</p>
                <h1 className="page-title">This account is not approved for admin.</h1>
              </div>
              <p className="supporting-copy">
                Add this email to `ADMIN_EMAILS` in Vercel, or sign in with an approved admin
                account instead.
              </p>
            </div>
            <div className="cta-row">
              <Link className="primary-cta" href="/">
                Return to homepage
              </Link>
            </div>
          </section>
        </main>
      );
    }

    if (destination.startsWith("/admin")) {
      redirect(destination);
    }

    const hasIntake = await hasPilotIntakeRequest(authenticatedEmail);
    redirect(hasIntake ? destination : withNext("/onboarding", destination));
  }

  if (brand === "cardiobunny") {
    return <CardioBunnySignInScreen next={handoff} signUpUrl={signUpUrl} />;
  }

  return (
    <main className="page-shell">
      <section className="panel panel-form">
        <div className="split-head">
          <div>
            <p className="section-label">Private Sign-In</p>
            <h1 className="page-title">Enter quietly. No account performance required.</h1>
          </div>
          <p className="supporting-copy">
            Clerk manages the session layer so members can return to their private circle
            without wrestling with repeated email prompts.
          </p>
        </div>

        <div className="clerk-shell">
          <SignIn forceRedirectUrl={handoff} path="/sign-in" routing="path" signUpUrl={signUpUrl} />
        </div>

        {showDevAccess ? (
          <div className="dev-access-panel">
            <p className="section-label">Local Development Shortcut</p>
            <p className="supporting-copy">
              Clerk is now the real path, but local development can still use a temporary
              session shortcut when we need to test quickly.
            </p>
            <div className="cta-row">
              <Link className="secondary-cta" href={`/dev-sign-in?next=${encodeURIComponent(handoff)}`}>
                Use local dev access
              </Link>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
