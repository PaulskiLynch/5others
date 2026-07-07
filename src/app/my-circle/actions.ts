"use server";

import { redirect } from "next/navigation";

import { requireAuthenticatedUserEmail } from "@/lib/auth";
import { postMessageToMyCircle, toggleSupportReactionForMessage } from "@/lib/circle";

export async function sendCircleMessage(formData: FormData) {
  const email = await requireAuthenticatedUserEmail();
  const body = String(formData.get("body") ?? "");
  const result = await postMessageToMyCircle(email, body);

  if (!result.ok) {
    redirect(`/my-circle?error=${encodeURIComponent(result.error)}`);
  }

  redirect("/my-circle");
}

export async function toggleSupportReaction(formData: FormData) {
  const email = await requireAuthenticatedUserEmail();
  const messageId = String(formData.get("messageId") ?? "");
  const kind = String(formData.get("kind") ?? "");

  if (!messageId || !["heart", "hug", "support"].includes(kind)) {
    redirect("/my-circle?error=Support%20could%20not%20be%20updated.");
  }

  const result = await toggleSupportReactionForMessage(
    email,
    messageId,
    kind as "heart" | "hug" | "support"
  );

  if (!result.ok) {
    redirect(`/my-circle?error=${encodeURIComponent(result.error)}`);
  }

  redirect("/my-circle");
}
