import Link from "next/link";
import { redirect } from "next/navigation";
import { SignIn } from "@clerk/nextjs";

import { CardioBunnySignInScreen } from "@/components/cardio-bunny/CardioBunnySignInScreen";
import { getAuthenticatedUserEmail, isLocalDevAuthEnabled } from "@/lib/auth";
import { getRequestBrandKey } from "@/lib/brand";
import { hasPilotIntakeRequest } from "@/lib/intake";
import { isSafeInternalPath, withNext } from "@/lib/navigation";

type SignInPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { next } = await searchParams;
  const brand = await getRequestBrandKey();
  const showDevAccess = isLocalDevAuthEnabled();
  const destination = next && isSafeInternalPath(next) ? next : "/my-circle";
  const handoff = withNext("/continue", destination);
  const authenticatedEmail = await getAuthenticatedUserEmail();

  if (authenticatedEmail) {
    if (destination.startsWith("/admin")) {
      redirect(destination);
    }

    const hasIntake = await hasPilotIntakeRequest(authenticatedEmail);
    redirect(hasIntake ? destination : withNext("/onboarding", destination));
  }

  if (brand === "cardiobunny") {
    return <CardioBunnySignInScreen next={handoff} />;
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
          <SignIn forceRedirectUrl={handoff} path="/sign-in" routing="path" signUpUrl="/sign-in" />
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
