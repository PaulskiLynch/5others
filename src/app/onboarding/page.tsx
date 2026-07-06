import { redirect } from "next/navigation";

import { CardioBunnyOnboardingScreen } from "@/components/cardio-bunny/CardioBunnyOnboardingScreen";
import { requireAuthenticatedUserEmail } from "@/lib/auth";
import { getRequestBrandKey } from "@/lib/brand";
import { hasPilotIntakeRequest } from "@/lib/intake";
import { isSafeInternalPath } from "@/lib/navigation";

type OnboardingPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const { error, next } = await searchParams;
  const email = await requireAuthenticatedUserEmail();
  const brand = await getRequestBrandKey();
  const destination = next && isSafeInternalPath(next) ? next : "/my-circle";
  const hasIntake = await hasPilotIntakeRequest(email);

  if (hasIntake) {
    redirect(destination);
  }

  if (brand === "cardiobunny") {
    return <CardioBunnyOnboardingScreen error={error} next={destination} />;
  }

  redirect(destination);
}
