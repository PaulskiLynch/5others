import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { generateWeeklyPseudonym } from "@/lib/pseudonyms";

type IntakeRow = {
  id: string;
  email: string;
  timezone: string;
  locale: string;
  preferred_language: string;
  cohort: string;
  category: string;
  goal: string;
  timezone_band: string;
  week_start: string;
  week_end: string;
  created_at: string;
};

type MatchCircle = {
  bucket: string;
  memberEmails: string[];
};

export type MatchPlan = {
  circles: MatchCircle[];
  leftovers: MatchCircle[];
};

type MatcherResult = {
  createdCircleCount: number;
  leftoverCount: number;
  weekStart: string;
};

const MIN_CIRCLE_SIZE = 4;
const TARGET_CIRCLE_SIZE = 6;

function bucketKey(intake: IntakeRow) {
  return `${intake.cohort}__${intake.preferred_language}__${intake.timezone_band}`;
}

function planBuckets(intakes: IntakeRow[]): MatchPlan {
  const grouped = new Map<string, IntakeRow[]>();

  for (const intake of intakes) {
    const key = bucketKey(intake);
    grouped.set(key, [...(grouped.get(key) ?? []), intake]);
  }

  const circles: MatchCircle[] = [];
  const leftovers: MatchCircle[] = [];

  for (const [bucket, items] of grouped.entries()) {
    const ordered = [...items].sort((a, b) => a.created_at.localeCompare(b.created_at));

    while (ordered.length >= TARGET_CIRCLE_SIZE) {
      const slice = ordered.splice(0, TARGET_CIRCLE_SIZE);
      circles.push({ bucket, memberEmails: slice.map((item) => item.email) });
    }

    if (ordered.length >= MIN_CIRCLE_SIZE) {
      circles.push({ bucket, memberEmails: ordered.map((item) => item.email) });
      continue;
    }

    if (ordered.length > 0) {
      leftovers.push({ bucket, memberEmails: ordered.map((item) => item.email) });
    }
  }

  return { circles, leftovers };
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function previewCardioBunnyMatchPlan(weekStart: string): Promise<MatchPlan> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase admin client is not configured.");
  }

  const { data, error } = await supabase
    .from("pilot_intake_requests")
    .select("*")
    .eq("week_start", weekStart)
    .eq("cohort", "cardiobunny")
    .eq("category", "fitness")
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return planBuckets((data ?? []) as IntakeRow[]);
}

export async function runCardioBunnyMatcher(weekStart: string): Promise<MatcherResult> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase admin client is not configured.");
  }

  const { data: intakeRows, error: intakeError } = await supabase
    .from("pilot_intake_requests")
    .select("*")
    .eq("week_start", weekStart)
    .eq("cohort", "cardiobunny")
    .eq("category", "fitness")
    .order("created_at", { ascending: true });

  if (intakeError) {
    throw intakeError;
  }

  const intakes = (intakeRows ?? []) as IntakeRow[];
  const plan = planBuckets(intakes);
  const weekEnd = intakes[0]?.week_end ?? weekStart;

  const { data: week, error: weekError } = await supabase
    .from("weeks")
    .upsert(
      {
        start_at: `${weekStart}T00:00:00.000Z`,
        end_at: `${weekEnd}T23:59:59.000Z`,
        status: "active",
      },
      { onConflict: "start_at" }
    )
    .select("*")
    .single();

  if (weekError) {
    throw weekError;
  }

  let createdCircleCount = 0;

  for (const plannedCircle of plan.circles) {
    const [cohort, language, timezoneBand] = plannedCircle.bucket.split("__");

    const users = [];
    for (const email of plannedCircle.memberEmails) {
      const intake = intakes.find((item) => normalizeEmail(item.email) === normalizeEmail(email));
      const { data: appUser, error: userError } = await supabase
        .from("app_users")
        .upsert(
          {
            auth_credential: normalizeEmail(email),
            timezone: intake?.timezone ?? "Europe/Warsaw",
            locale: intake?.locale ?? language,
            status: "active",
          },
          { onConflict: "auth_credential" }
        )
        .select("*")
        .single();

      if (userError) {
        throw userError;
      }

      users.push({ appUser, intake });

      const { error: intentError } = await supabase.from("intents").upsert(
        {
          user_id: appUser.id,
          week_id: week.id,
          category: "fitness",
          free_text: intake?.goal ?? "",
          timezone_band: timezoneBand,
          language,
        },
        { onConflict: "user_id,week_id" }
      );

      if (intentError) {
        throw intentError;
      }
    }

    const { data: existingCircles, error: existingCircleError } = await supabase
      .from("memberships")
      .select("id, user_id, circle_id, circles!inner(id, week_id)")
      .in("user_id", users.map(({ appUser }) => appUser.id))
      .eq("circles.week_id", week.id);

    if (existingCircleError) {
      throw existingCircleError;
    }

    if ((existingCircles ?? []).length > 0) {
      continue;
    }

    const { data: circle, error: circleError } = await supabase
      .from("circles")
      .insert({
        week_id: week.id,
        category: "fitness",
        language,
        timezone_band: timezoneBand,
        member_count: users.length,
        status: "active",
      })
      .select("*")
      .single();

    if (circleError) {
      throw circleError;
    }

    const usedNames = new Set<string>();
    const memberships = users.map(({ appUser }, index) => {
      let attempt = 0;
      while (attempt < 40) {
        const generated = generateWeeklyPseudonym(`${circle.id}-${appUser.id}-${attempt}`);
        if (!usedNames.has(generated.pseudonym)) {
          usedNames.add(generated.pseudonym);
          return {
            circle_id: circle.id,
            user_id: appUser.id,
            pseudonym: generated.pseudonym,
            accent_color: generated.accentColor,
            status: "active",
          };
        }
        attempt += 1;
      }

      return {
        circle_id: circle.id,
        user_id: appUser.id,
        pseudonym: `Quiet Bunny ${index + 1}`,
        accent_color: "#C75C2A",
        status: "active",
      };
    });

    const { error: membershipError } = await supabase.from("memberships").insert(memberships);

    if (membershipError) {
      throw membershipError;
    }

    createdCircleCount += 1;
  }

  return {
    createdCircleCount,
    leftoverCount: plan.leftovers.reduce((sum, leftover) => sum + leftover.memberEmails.length, 0),
    weekStart,
  };
}
