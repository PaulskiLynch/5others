import { sendCircleReadyEmail } from "@/lib/email";
import {
  getCircleReadyCandidates,
  getTodayUtcDate,
  recordNotificationDelivery,
} from "@/lib/notifications";

export type CircleReadyRunSummary = {
  mode: "live" | "preview";
  queuedCandidates: number;
  results: Array<{
    email: string;
    status: "preview" | "sent" | "failed";
    weekStart: string;
  }>;
  runDate: string;
};

export async function runCircleReadyNotifications(runDate = getTodayUtcDate()): Promise<CircleReadyRunSummary> {
  const candidates = await getCircleReadyCandidates(runDate);
  const results: CircleReadyRunSummary["results"] = [];
  const mode = process.env.RESEND_API_KEY && process.env.EMAIL_FROM ? "live" : "preview";

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

  return {
    mode,
    queuedCandidates: candidates.length,
    results,
    runDate,
  };
}
