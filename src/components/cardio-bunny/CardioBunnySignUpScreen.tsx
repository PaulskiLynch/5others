import Link from "next/link";
import { SignUp } from "@clerk/nextjs";

import { isLocalDevAuthEnabled } from "@/lib/auth";

import { CardioBunnyEntryShell } from "./CardioBunnyEntryShell";

type CardioBunnySignUpScreenProps = {
  next: string;
  signInUrl: string;
};

export function CardioBunnySignUpScreen({
  next,
  signInUrl,
}: CardioBunnySignUpScreenProps) {
  const showDevAccess = isLocalDevAuthEnabled();

  return (
    <CardioBunnyEntryShell
      cardSubtitle="Create your private access first, then we&apos;ll ask a few quiet matching questions."
      cardTitle="Enter this week&apos;s CardioBunny circles"
    >
      <div className="clerk-shell clerk-shell-cardiobunny">
        <SignUp
          forceRedirectUrl={next}
          path="/sign-up"
          routing="path"
          signInUrl={signInUrl}
        />
      </div>

      {showDevAccess ? (
        <div className="cb-dev-panel">
          <p className="cb-dev-label">Local development shortcut</p>
          <p className="cb-dev-copy">
            Clerk is the real member path, but local development can still use a temporary
            session shortcut when we need to test quickly.
          </p>
          <Link className="cb-dev-link" href={`/dev-sign-in?next=${encodeURIComponent(next)}`}>
            Use local dev access
          </Link>
        </div>
      ) : null}
    </CardioBunnyEntryShell>
  );
}
