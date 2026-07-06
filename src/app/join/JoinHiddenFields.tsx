"use client";

const browserTimezone =
  typeof window === "undefined" ? "UTC" : Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
const browserLocale = typeof window === "undefined" ? "en-US" : navigator.language || "en-US";
const browserLanguage = browserLocale.toLowerCase().startsWith("pl") ? "pl" : "en";

export function JoinHiddenFields() {
  return (
    <>
      <input defaultValue={browserTimezone} name="timezone" suppressHydrationWarning type="hidden" />
      <input defaultValue={browserLocale} name="locale" suppressHydrationWarning type="hidden" />
      <input
        defaultValue={browserLanguage}
        name="preferredLanguage"
        suppressHydrationWarning
        type="hidden"
      />
      <input defaultValue="cardiobunny" name="cohort" type="hidden" />
      <input defaultValue="fitness" name="category" type="hidden" />
      <input defaultValue="30-44" name="ageRange" type="hidden" />
      <input defaultValue="gentle_accountability" name="supportStyle" type="hidden" />
      <input defaultValue="on" name="acceptsSafety" type="hidden" />
      <input defaultValue="on" name="acceptsNoDmRule" type="hidden" />
    </>
  );
}
