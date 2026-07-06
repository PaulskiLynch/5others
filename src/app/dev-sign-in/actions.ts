"use server";

import { redirect } from "next/navigation";

import { clearDeveloperEmailOverride, isLocalDevAuthEnabled, setDeveloperEmailOverride } from "@/lib/auth";

export async function startDeveloperSession(formData: FormData) {
  if (!isLocalDevAuthEnabled()) {
    redirect("/sign-in");
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const next = String(formData.get("next") ?? "/my-circle");

  if (!email) {
    redirect(`/sign-in?next=${encodeURIComponent(next)}&error=${encodeURIComponent("Enter an email for local dev access.")}`);
  }

  await setDeveloperEmailOverride(email);
  redirect(next);
}

export async function stopDeveloperSession() {
  await clearDeveloperEmailOverride();
  redirect("/sign-in");
}
