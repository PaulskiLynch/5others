"use client";

import { useClerk } from "@clerk/nextjs";

type SignOutActionProps = {
  className: string;
  label?: string;
  redirectTo?: string;
};

export function SignOutAction({ className, label = "Sign out", redirectTo = "/sign-in" }: SignOutActionProps) {
  const { signOut } = useClerk();

  return (
    <button
      className={className}
      onClick={() => signOut({ redirectUrl: redirectTo })}
      type="button"
    >
      {label}
    </button>
  );
}
