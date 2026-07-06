"use server";

import { redirect } from "next/navigation";

import { requireAdminUserEmail } from "@/lib/auth";
import { runCircleReadyNotifications } from "@/lib/circle-ready";

export async function triggerCircleReadyNotifications(formData: FormData) {
  await requireAdminUserEmail();

  const requestedDate = String(formData.get("runDate") ?? "").trim();
  const summary = await runCircleReadyNotifications(requestedDate || undefined);
  const sent = summary.results.filter((item) => item.status === "sent").length;
  const preview = summary.results.filter((item) => item.status === "preview").length;
  const failed = summary.results.filter((item) => item.status === "failed").length;

  redirect(
    `/admin?notice=${encodeURIComponent(
      `Circle-ready run complete: ${sent} sent, ${preview} preview, ${failed} failed.`
    )}`
  );
}
