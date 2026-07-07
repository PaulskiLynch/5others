"use client";

const browserTimezone =
  typeof window === "undefined" ? "UTC" : Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
const browserLocale = typeof window === "undefined" ? "en-US" : navigator.language || "en-US";

export function OnboardingHiddenFields() {
  return (
    <>
      <input defaultValue={browserTimezone} name="timezone" suppressHydrationWarning type="hidden" />
      <input defaultValue={browserLocale} name="locale" suppressHydrationWarning type="hidden" />
      <input defaultValue="cardiobunny" name="cohort" type="hidden" />
      <input defaultValue="fitness" name="category" type="hidden" />
      <input defaultValue="" name="fitnessGoal" type="hidden" />
      <input defaultValue="on" name="acceptsSafety" type="hidden" />
      <input defaultValue="on" name="acceptsNoDmRule" type="hidden" />
    </>
  );
}
