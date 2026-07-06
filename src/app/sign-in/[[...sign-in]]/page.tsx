import Link from "next/link";
import { redirect } from "next/navigation";
import { SignIn } from "@clerk/nextjs";

import { CardioBunnySignInScreen } from "@/components/cardio-bunny/CardioBunnySignInScreen";
import { getAuthenticatedUserEmail, isLocalDevAuthEnabled } from "@/lib/auth";
import { getRequestBrandKey } from "@/lib/brand";

type SignInPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { next } = await searchParams;
  const brand = await getRequestBrandKey();
  const showDevAccess = isLocalDevAuthEnabled();
  const destination = next ?? "/my-circle";
  const authenticatedEmail = await getAuthenticatedUserEmail();

  if (authenticatedEmail) {
    redirect(destination);
  }

  if (brand === "cardiobunny") {
    return <CardioBunnySignInScreen next={destination} />;
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
          <SignIn forceRedirectUrl={destination} path="/sign-in" routing="path" signUpUrl="/sign-in" />
        </div>

        {showDevAccess ? (
          <div className="dev-access-panel">
            <p className="section-label">Local Development Shortcut</p>
            <p className="supporting-copy">
              Clerk is now the real path, but local development can still use a temporary
              session shortcut when we need to test quickly.
            </p>
            <div className="cta-row">
              <Link className="secondary-cta" href={`/dev-sign-in?next=${encodeURIComponent(destination)}`}>
                Use local dev access
              </Link>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
