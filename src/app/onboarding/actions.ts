"use server";

import { redirect } from "next/navigation";

import { requireAuthenticatedUserEmail } from "@/lib/auth";
import { createPilotIntakeRequest } from "@/lib/intake";

export async function submitAuthenticatedIntake(formData: FormData) {
  const email = await requireAuthenticatedUserEmail();
  const next = String(formData.get("next") ?? "/my-circle");

  const result = await createPilotIntakeRequest({
    email,
    timezone: String(formData.get("timezone") ?? ""),
    locale: String(formData.get("locale") ?? "en"),
    preferredLanguage: String(formData.get("preferredLanguage") ?? "en"),
    cohort: String(formData.get("cohort") ?? "cardiobunny"),
    category: String(formData.get("category") ?? ""),
    ageRange: String(formData.get("ageRange") ?? ""),
    startingPoint: String(formData.get("startingPoint") ?? ""),
    supportStyle: String(formData.get("supportStyle") ?? ""),
    fitnessGoal: String(formData.get("fitnessGoal") ?? ""),
    goal: String(formData.get("goal") ?? ""),
    acceptsSafety: formData.get("acceptsSafety") === "on",
    acceptsNoDmRule: formData.get("acceptsNoDmRule") === "on",
  });

  if (!result.ok) {
    redirect(`/onboarding?error=${encodeURIComponent(result.error)}&next=${encodeURIComponent(next)}`);
  }

  redirect(
    `/waiting?weekStart=${encodeURIComponent(result.weekStart)}&weekEnd=${encodeURIComponent(
      result.weekEnd
    )}&mode=${result.mode}&band=${encodeURIComponent(result.timezoneBand)}`
  );
}
