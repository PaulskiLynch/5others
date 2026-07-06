import Link from "next/link";
import { SignIn } from "@clerk/nextjs";

import { isLocalDevAuthEnabled } from "@/lib/auth";

import { CardioBunnyEntryShell } from "./CardioBunnyEntryShell";

type CardioBunnySignInScreenProps = {
  next: string;
};

export function CardioBunnySignInScreen({ next }: CardioBunnySignInScreenProps) {
  const showDevAccess = isLocalDevAuthEnabled();

  return (
    <CardioBunnyEntryShell
      cardSubtitle="Use a calmer sign-in flow that remembers you properly."
      cardTitle="Enter this week&apos;s circle"
    >
      <div className="clerk-shell clerk-shell-cardiobunny">
        <SignIn forceRedirectUrl={next} path="/sign-in" routing="path" signUpUrl="/sign-in" />
      </div>

      {showDevAccess ? (
        <div className="cb-dev-panel">
          <p className="cb-dev-label">Local development shortcut</p>
          <p className="cb-dev-copy">
            Magic links are still the real path, but local development can use a temporary
            session to avoid email throttling.
          </p>
          <Link className="cb-dev-link" href={`/dev-sign-in?next=${encodeURIComponent(next)}`}>
            Use local dev access
          </Link>
        </div>
      ) : null}
    </CardioBunnyEntryShell>
  );
}
