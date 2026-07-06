import { redirect } from "next/navigation";

import { getAuthenticatedUserEmail } from "@/lib/auth";
import { hasPilotIntakeRequest } from "@/lib/intake";
import { isSafeInternalPath, withNext } from "@/lib/navigation";

type ContinuePageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function ContinuePage({ searchParams }: ContinuePageProps) {
  const { next } = await searchParams;
  const email = await getAuthenticatedUserEmail();
  const intendedPath = next && isSafeInternalPath(next) ? next : "/my-circle";

  if (!email) {
    redirect(withNext("/sign-in", intendedPath));
  }

  if (intendedPath.startsWith("/admin")) {
    redirect(intendedPath);
  }

  const hasIntake = await hasPilotIntakeRequest(email);
  redirect(hasIntake ? intendedPath : withNext("/onboarding", intendedPath));
}
