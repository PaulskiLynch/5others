import { NextResponse } from "next/server";

import {
  getCircleReadyCandidates,
  getTodayUtcDate,
  recordNotificationDelivery,
} from "@/lib/notifications";
import { sendCircleReadyEmail } from "@/lib/email";

export const runtime = "nodejs";

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return true;
  }

  const authorization = request.headers.get("authorization");
  return authorization === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const runDate = new URL(request.url).searchParams.get("date") ?? getTodayUtcDate();
    const candidates = await getCircleReadyCandidates(runDate);

    const results: Array<Record<string, string>> = [];

    for (const candidate of candidates) {
      try {
        const outcome = await sendCircleReadyEmail(candidate);

        if (outcome.mode === "preview") {
          await recordNotificationDelivery({
            email: candidate.email,
            cohort: candidate.cohort,
            weekStart: candidate.weekStart,
            status: "preview",
            provider: outcome.provider,
            previewPayload: {
              subject: outcome.subject,
              to: outcome.to,
            },
          });

          results.push({
            email: candidate.email,
            status: "preview",
            weekStart: candidate.weekStart,
          });
          continue;
        }

        await recordNotificationDelivery({
          email: candidate.email,
          cohort: candidate.cohort,
          weekStart: candidate.weekStart,
          status: "sent",
          provider: outcome.provider,
          providerMessageId: outcome.messageId,
        });

        results.push({
          email: candidate.email,
          status: "sent",
          weekStart: candidate.weekStart,
        });
      } catch (error) {
        await recordNotificationDelivery({
          email: candidate.email,
          cohort: candidate.cohort,
          weekStart: candidate.weekStart,
          status: "failed",
          provider: "resend",
          errorMessage: error instanceof Error ? error.message : "Unknown send failure",
        });

        results.push({
          email: candidate.email,
          status: "failed",
          weekStart: candidate.weekStart,
        });
      }
    }

    return NextResponse.json({
      runDate,
      queuedCandidates: candidates.length,
      results,
      mode: process.env.RESEND_API_KEY && process.env.EMAIL_FROM ? "live" : "preview",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown notification failure",
      },
      { status: 500 }
    );
  }
}
