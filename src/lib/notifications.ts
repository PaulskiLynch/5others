import { getSupabaseAdminClient } from "@/lib/supabase/admin";

type IntakeRow = {
  id: string;
  email: string;
  cohort: string;
  week_start: string;
  created_at: string;
};

type NotificationDeliveryRow = {
  id: string;
  email: string;
  notification_type: string;
  week_start: string;
};

export type CircleReadyCandidate = {
  email: string;
  cohort: string;
  weekStart: string;
};

export function getTodayUtcDate() {
  return new Date().toISOString().slice(0, 10);
}

export async function getCircleReadyCandidates(runDate = getTodayUtcDate()) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase admin client is not configured.");
  }

  const { data: intakes, error: intakeError } = await supabase
    .from("pilot_intake_requests")
    .select("id, email, cohort, week_start, created_at")
    .lte("week_start", runDate)
    .order("created_at", { ascending: false });

  if (intakeError) {
    throw intakeError;
  }

  const { data: deliveries, error: deliveryError } = await supabase
    .from("notification_deliveries")
    .select("id, email, notification_type, week_start")
    .eq("notification_type", "circle_ready");

  if (deliveryError) {
    throw deliveryError;
  }

  const sentKeys = new Set(
    ((deliveries ?? []) as NotificationDeliveryRow[]).map(
      (delivery) => `${delivery.email.toLowerCase()}__${delivery.week_start}`
    )
  );

  const latestByEmailAndWeek = new Map<string, CircleReadyCandidate>();

  for (const intake of (intakes ?? []) as IntakeRow[]) {
    const key = `${intake.email.trim().toLowerCase()}__${intake.week_start}`;

    if (sentKeys.has(key) || latestByEmailAndWeek.has(key)) {
      continue;
    }

    latestByEmailAndWeek.set(key, {
      email: intake.email.trim().toLowerCase(),
      cohort: intake.cohort,
      weekStart: intake.week_start,
    });
  }

  return Array.from(latestByEmailAndWeek.values());
}

export async function recordNotificationDelivery(input: {
  email: string;
  cohort: string;
  weekStart: string;
  status: "preview" | "sent" | "failed";
  provider: string;
  providerMessageId?: string | null;
  errorMessage?: string | null;
  previewPayload?: Record<string, unknown> | null;
}) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase admin client is not configured.");
  }

  const { error } = await supabase.from("notification_deliveries").upsert(
    {
      email: input.email,
      cohort: input.cohort,
      notification_type: "circle_ready",
      week_start: input.weekStart,
      status: input.status,
      provider: input.provider,
      provider_message_id: input.providerMessageId ?? null,
      error_message: input.errorMessage ?? null,
      preview_payload: input.previewPayload ?? null,
    },
    { onConflict: "email,notification_type,week_start" }
  );

  if (error) {
    throw error;
  }
}
