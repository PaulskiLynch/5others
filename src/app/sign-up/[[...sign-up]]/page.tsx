import Link from "next/link";
import { redirect } from "next/navigation";
import { SignUp } from "@clerk/nextjs";

import { CardioBunnySignUpScreen } from "@/components/cardio-bunny/CardioBunnySignUpScreen";
import { getAuthenticatedUserEmail, isLocalDevAuthEnabled } from "@/lib/auth";
import { getRequestBrandKey } from "@/lib/brand";
import { hasPilotIntakeRequest } from "@/lib/intake";
import { isSafeInternalPath, withNext } from "@/lib/navigation";

type SignUpPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const { next } = await searchParams;
  const brand = await getRequestBrandKey();
  const showDevAccess = isLocalDevAuthEnabled();
  const destination = next && isSafeInternalPath(next) ? next : "/my-circle";
  const handoff = withNext("/continue", destination);
  const signInUrl = withNext("/sign-in", destination);
  const authenticatedEmail = await getAuthenticatedUserEmail();

  if (authenticatedEmail) {
    if (destination.startsWith("/admin")) {
      redirect(destination);
    }

    const hasIntake = await hasPilotIntakeRequest(authenticatedEmail);
    redirect(hasIntake ? destination : withNext("/onboarding", destination));
  }

  if (brand === "cardiobunny") {
    return <CardioBunnySignUpScreen next={handoff} signInUrl={signInUrl} />;
  }

  return (
    <main className="page-shell">
      <section className="panel panel-form">
        <div className="split-head">
          <div>
            <p className="section-label">Private Sign-Up</p>
            <h1 className="page-title">Create your quiet access to the circle.</h1>
          </div>
          <p className="supporting-copy">
            Make a simple account first, then we&apos;ll gather the matching details that help place
            you with the right five others.
          </p>
        </div>

        <div className="clerk-shell">
          <SignUp forceRedirectUrl={handoff} path="/sign-up" routing="path" signInUrl={signInUrl} />
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
