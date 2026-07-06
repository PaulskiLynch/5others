import Link from "next/link";
import { redirect } from "next/navigation";

import { getAuthenticatedUserEmail, isLocalDevAuthEnabled } from "@/lib/auth";
import { getRequestBrandKey } from "@/lib/brand";
import { CardioBunnySignInScreen } from "@/components/cardio-bunny/CardioBunnySignInScreen";

import { SignInForm } from "./SignInForm";

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
            <p className="section-label">Magic Link Sign-In</p>
            <h1 className="page-title">Enter quietly. No account performance required.</h1>
          </div>
          <p className="supporting-copy">
            We use email magic links for Phase 1 so each member can return to her own
            private circle without passwords or public profiles.
          </p>
        </div>

        <SignInForm next={destination} />

        {showDevAccess ? (
          <div className="dev-access-panel">
            <p className="section-label">Local Development Shortcut</p>
            <p className="supporting-copy">
              Magic links are still the real path, but local development can use a
              temporary dev session to avoid email throttling.
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
