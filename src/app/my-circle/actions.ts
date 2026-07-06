"use server";

import { redirect } from "next/navigation";

import { requireAuthenticatedUserEmail } from "@/lib/auth";
import { postMessageToMyCircle } from "@/lib/circle";

export async function sendCircleMessage(formData: FormData) {
  const email = await requireAuthenticatedUserEmail();
  const body = String(formData.get("body") ?? "");
  const result = await postMessageToMyCircle(email, body);

  if (!result.ok) {
    redirect(`/my-circle?error=${encodeURIComponent(result.error)}`);
  }

  redirect("/my-circle");
}
