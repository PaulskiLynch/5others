import Link from "next/link";

import { isLocalDevAuthEnabled } from "@/lib/auth";
import { SignInForm } from "@/app/sign-in/SignInForm";

import { CardioBunnyEntryShell } from "./CardioBunnyEntryShell";

type CardioBunnySignInScreenProps = {
  next: string;
};

export function CardioBunnySignInScreen({ next }: CardioBunnySignInScreenProps) {
  const showDevAccess = isLocalDevAuthEnabled();

  return (
    <CardioBunnyEntryShell
      cardSubtitle="Use your email magic link to return quietly."
      cardTitle="Enter this week&apos;s circle"
    >
      <SignInForm next={next} theme="cardiobunny" />

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
