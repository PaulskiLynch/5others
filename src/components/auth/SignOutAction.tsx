"use client";

import { useClerk } from "@clerk/nextjs";

type SignOutActionProps = {
  className: string;
  redirectTo?: string;
};

export function SignOutAction({ className, redirectTo = "/sign-in" }: SignOutActionProps) {
  const { signOut } = useClerk();

  return (
    <button
      className={className}
      onClick={() => signOut({ redirectUrl: redirectTo })}
      type="button"
    >
      Sign out
    </button>
  );
}
