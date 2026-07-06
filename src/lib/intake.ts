import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { intakeRequestSchema } from "@/lib/validation";
import { getTimezoneBandLabel, getUpcomingWeekWindow } from "@/lib/week";

export type IntakeResult =
  | {
      ok: true;
      mode: "supabase";
      weekStart: string;
      weekEnd: string;
      timezoneBand: string;
    }
  | {
      ok: true;
      mode: "preview";
      weekStart: string;
      weekEnd: string;
      timezoneBand: string;
    }
  | {
      ok: false;
      error: string;
    };

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function getLatestPilotIntakeRequest(email: string) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("pilot_intake_requests")
    .select("*")
    .eq("email", normalizeEmail(email))
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function hasPilotIntakeRequest(email: string) {
  const intake = await getLatestPilotIntakeRequest(email);
  return Boolean(intake);
}

export async function createPilotIntakeRequest(
  input: Record<string, unknown>
): Promise<IntakeResult> {
  const parsed = intakeRequestSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: "Please complete every field with a valid email, timezone, and weekly goal.",
    };
  }

  const { weekStart, weekEnd } = getUpcomingWeekWindow(parsed.data.timezone);
  const timezoneBand = getTimezoneBandLabel(parsed.data.timezone);
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return {
      ok: true,
      mode: "preview",
      weekStart,
      weekEnd,
      timezoneBand,
    };
  }

  const { error } = await supabase.from("pilot_intake_requests").insert({
    email: normalizeEmail(parsed.data.email),
    timezone: parsed.data.timezone,
    locale: parsed.data.locale,
    preferred_language: parsed.data.preferredLanguage,
    cohort: parsed.data.cohort,
    category: parsed.data.category,
    age_range: parsed.data.ageRange,
    starting_point: parsed.data.startingPoint,
    support_style: parsed.data.supportStyle,
    fitness_goal: parsed.data.fitnessGoal ?? null,
    goal: parsed.data.goal,
    timezone_band: timezoneBand,
    week_start: weekStart,
    week_end: weekEnd,
  });

  if (error) {
    return {
      ok: false,
      error: "The intake request could not be saved right now. Please try again shortly.",
    };
  }

  return {
    ok: true,
    mode: "supabase",
    weekStart,
    weekEnd,
    timezoneBand,
  };
}
