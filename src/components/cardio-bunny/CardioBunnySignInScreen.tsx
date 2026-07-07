import Link from "next/link";
import { SignIn } from "@clerk/nextjs";

import { isLocalDevAuthEnabled } from "@/lib/auth";

import { CardioBunnyEntryShell } from "./CardioBunnyEntryShell";

type CardioBunnySignInScreenProps = {
  next: string;
  path?: string;
  routing?: "hash" | "path";
  signUpUrl: string;
  withSignUp?: boolean;
};

export function CardioBunnySignInScreen({
  next,
  path = "/sign-in",
  routing = "path",
  signUpUrl,
  withSignUp = false,
}: CardioBunnySignInScreenProps) {
  const showDevAccess = isLocalDevAuthEnabled();
  const routingProps: Record<string, string | boolean> =
    routing === "hash"
      ? ({
          path,
          routing: "hash",
          signUpForceRedirectUrl: next,
          signUpUrl,
          withSignUp,
        } as const)
      : ({
          path,
          routing: "path",
          signUpForceRedirectUrl: next,
          signUpUrl,
          withSignUp,
        } as const);

  return (
    <CardioBunnyEntryShell
      cardSubtitle="Sign in first, then we&apos;ll ask a few quiet matching questions."
      cardTitle="Enter this week&apos;s CardioBunny circles"
    >
      <div className="clerk-shell clerk-shell-cardiobunny">
        <SignIn forceRedirectUrl={next} {...routingProps} />
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
