import { revalidatePath } from "next/cache";

import { getDeveloperEmailOverride } from "@/lib/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { generateWeeklyPseudonym } from "@/lib/pseudonyms";
import {
  getDayNumberInWeek,
  getIsoDateInTimeZone,
  getTimezoneBandLabel,
  getUpcomingWeekWindow,
  getWeekdayIndexForTimeZone,
} from "@/lib/week";

type AppUserRow = {
  id: string;
  auth_credential: string;
  timezone: string;
  locale: string;
  status: string;
};

type MembershipRow = {
  id: string;
  user_id: string;
  circle_id: string;
  pseudonym: string;
  accent_color: string;
  status: string;
  created_at: string;
};

type MessageRow = {
  id: string;
  membership_id: string;
  body: string;
  created_at: string;
};

export type CircleViewModel = {
  category: string;
  checkedInTodayCount: number;
  dayName: string;
  dayLabel: string;
  dayNumber: number;
  hasPostedToday: boolean;
  memberCount: number;
  memberships: Array<
    MembershipRow & {
      hasPostedToday: boolean;
      isYou: boolean;
    }
  >;
  messages: Array<
    MessageRow & {
      authorName: string;
      accentColor: string;
      groupedWithPrevious: boolean;
      isOwn: boolean;
      tone: "blush" | "porcelain";
      relativeTime: string;
    }
  >;
  prompt: string;
  promptTitle: string;
  weekRangeLabel: string;
  userMembership: MembershipRow;
};

type CircleRow = {
  id: string;
  category: string;
};

const seededMessages = [
  "I restarted my morning walk today. Only twelve minutes, but it counted.",
  "That counts. A restart is still movement. I am beginning again today too.",
  "Water first, shoes on second. What's the smallest version of the walk you can do today?",
  "Mine is just to get outside before lunch. I keep overthinking it when I stay indoors.",
  "Same. If I make it tiny enough, I usually do it. Five minutes still changes the day.",
] as const;

const displayNames = [
  "Silver Cottontail",
  "Gentle Cottontail",
  "Brave Cottontail",
  "Open Cottontail",
  "Calm Cottontail",
] as const;

const dailyPrompt = "What's the smallest version of your walk today?";

const weekdayPrompts = [
  "Last day together. Say what mattered before the circle closes tonight.",
  "Welcome in. Everyone is beginning together.",
  "Small steps count today.",
  "Halfway through. How are you really doing?",
  "Someone in your circle may need encouragement today.",
  "Celebrate even the tiny wins.",
  "Take a quiet moment to reflect.",
] as const;

const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

const weekdayPromptTitles = [
  "Today's reflection",
  "Today's reflection",
  "Today's reflection",
  "Today's reflection",
  "Today's reflection",
  "Today's reflection",
  "Today's reflection",
] as const;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isUniqueViolation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "23505"
  );
}

function formatMessageTime(value: string, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  }).format(new Date(value));
}

function formatWeekRangeLabel(weekStart: string, weekEnd: string) {
  const start = new Date(`${weekStart}T12:00:00Z`);
  const end = new Date(`${weekEnd}T12:00:00Z`);
  const startLabel = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" }).format(start);
  const endLabel = new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(end);
  return `${startLabel}-${endLabel}`;
}

function buildDisplayNameMap(
  memberships: MembershipRow[],
  signedInUserId: string
) {
  const map = new Map<string, string>();
  let nextAliasIndex = 0;

  for (const membership of memberships) {
    if (membership.user_id === signedInUserId) {
      map.set(membership.id, "You");
      continue;
    }

    const alias = displayNames[nextAliasIndex] ?? `Cottontail ${nextAliasIndex + 1}`;
    map.set(membership.id, alias);
    nextAliasIndex += 1;
  }

  return map;
}

async function getLatestIntake(email: string) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase admin client is not configured.");
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

async function ensureAppUser(email: string) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase admin client is not configured.");
  }

  const normalizedEmail = normalizeEmail(email);
  const { data: existing, error: existingError } = await supabase
    .from("app_users")
    .select("*")
    .eq("auth_credential", normalizedEmail)
    .maybeSingle<AppUserRow>();

  if (existingError) {
    throw existingError;
  }

  if (existing) {
    return existing;
  }

  const intake = await getLatestIntake(normalizedEmail);
  const fallbackZone = "Europe/Warsaw";
  const fallbackLocale = "en";

  const { data, error } = await supabase
    .from("app_users")
    .insert({
      auth_credential: normalizedEmail,
      timezone: intake?.timezone ?? fallbackZone,
      locale: intake?.locale ?? fallbackLocale,
      status: "active",
    })
    .select("*")
    .single<AppUserRow>();

  if (error) {
    throw error;
  }

  return data;
}

async function ensureWeekForUser(user: AppUserRow) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase admin client is not configured.");
  }

  const intake = await getLatestIntake(user.auth_credential);
  const window = getUpcomingWeekWindow(user.timezone);
  const weekStart = intake?.week_start ?? window.weekStart;
  const weekEnd = intake?.week_end ?? window.weekEnd;
  const startAt = `${weekStart}T00:00:00.000Z`;
  const endAt = `${weekEnd}T23:59:59.000Z`;

  const { data: existing, error: existingError } = await supabase
    .from("weeks")
    .select("*")
    .eq("start_at", startAt)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (existing) {
    return { week: existing, intake };
  }

  const { data, error } = await supabase
    .from("weeks")
    .insert({
      start_at: startAt,
      end_at: endAt,
      status: "active",
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return { week: data, intake };
}

function makeUniquePseudonym(seed: string, existing: Set<string>) {
  let attempt = 0;

  while (attempt < 40) {
    const generated = generateWeeklyPseudonym(`${seed}-${attempt}`);
    if (!existing.has(generated.pseudonym)) {
      existing.add(generated.pseudonym);
      return generated;
    }
    attempt += 1;
  }

  throw new Error("Could not generate a unique pseudonym.");
}

async function ensureMembershipsAndMessages(circleId: string, user: AppUserRow) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase admin client is not configured.");
  }

  const { data: currentMemberships, error: membershipError } = await supabase
    .from("memberships")
    .select("*")
    .eq("circle_id", circleId)
    .order("created_at", { ascending: true });

  if (membershipError) {
    throw membershipError;
  }

  const memberships = (currentMemberships ?? []) as MembershipRow[];
  const existingNames = new Set(memberships.map((membership) => membership.pseudonym));

  let userMembership = memberships.find((membership) => membership.user_id === user.id);

  if (!userMembership) {
    const generated = makeUniquePseudonym(`${circleId}-${user.auth_credential}`, existingNames);
    const { data, error } = await supabase
      .from("memberships")
      .insert({
        circle_id: circleId,
        user_id: user.id,
        pseudonym: generated.pseudonym,
        accent_color: generated.accentColor,
        status: "active",
      })
      .select("*")
      .single<MembershipRow>();

    if (error) {
      if (!isUniqueViolation(error)) {
        throw error;
      }

      const { data: existingUserMembership, error: existingUserMembershipError } = await supabase
        .from("memberships")
        .select("*")
        .eq("circle_id", circleId)
        .eq("user_id", user.id)
        .maybeSingle<MembershipRow>();

      if (existingUserMembershipError) {
        throw existingUserMembershipError;
      }

      if (!existingUserMembership) {
        throw error;
      }

      userMembership = existingUserMembership;
      memberships.push(existingUserMembership);
    } else {
      userMembership = data;
      memberships.push(data);
    }
  }

  for (let index = memberships.length; index < 6; index += 1) {
    const seedEmail = `seed-${circleId}-${index}@5others.local`;
    const { data: seedUser, error: seedUserError } = await supabase
      .from("app_users")
      .upsert(
        {
          auth_credential: seedEmail,
          timezone: user.timezone,
          locale: user.locale,
          status: "active",
        },
        { onConflict: "auth_credential" }
      )
      .select("*")
      .single<AppUserRow>();

    if (seedUserError) {
      throw seedUserError;
    }

    const generated = makeUniquePseudonym(`${circleId}-seed-${index}`, existingNames);

    const { data: membership, error: insertMembershipError } = await supabase
      .from("memberships")
      .insert({
        circle_id: circleId,
        user_id: seedUser.id,
        pseudonym: generated.pseudonym,
        accent_color: generated.accentColor,
        status: "active",
      })
      .select("*")
      .single<MembershipRow>();

    if (insertMembershipError) {
      if (!isUniqueViolation(insertMembershipError)) {
        throw insertMembershipError;
      }

      const { data: existingSeedMembership, error: existingSeedMembershipError } = await supabase
        .from("memberships")
        .select("*")
        .eq("circle_id", circleId)
        .eq("user_id", seedUser.id)
        .maybeSingle<MembershipRow>();

      if (existingSeedMembershipError) {
        throw existingSeedMembershipError;
      }

      if (!existingSeedMembership) {
        throw insertMembershipError;
      }

      if (!memberships.some((item) => item.id === existingSeedMembership.id)) {
        memberships.push(existingSeedMembership);
      }
      continue;
    }

    memberships.push(membership);
  }

  await supabase.from("circles").update({ member_count: memberships.length }).eq("id", circleId);

  const { count } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("circle_id", circleId);

  if (!count) {
    const seedRows = seededMessages.map((body, index) => ({
      circle_id: circleId,
      membership_id: memberships[(index + 1) % memberships.length].id,
      body,
      moderation_status: "clean",
    }));

    const { error } = await supabase.from("messages").insert(seedRows);

    if (error) {
      throw error;
    }
  }

  return { memberships, userMembership };
}

async function ensureCircleForUser(user: AppUserRow) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase admin client is not configured.");
  }

  const { data: activeMemberships, error: activeMembershipError } = await supabase
    .from("memberships")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1);

  if (activeMembershipError) {
    throw activeMembershipError;
  }

  const existingMembership = (activeMemberships ?? [])[0] as MembershipRow | undefined;

  if (existingMembership) {
    return existingMembership.circle_id;
  }

  const { week, intake } = await ensureWeekForUser(user);
  const timezoneBand = getTimezoneBandLabel(user.timezone);

  const { data: existingIntent, error: existingIntentError } = await supabase
    .from("intents")
    .select("*")
    .eq("user_id", user.id)
    .eq("week_id", week.id)
    .maybeSingle();

  if (existingIntentError) {
    throw existingIntentError;
  }

  const category = intake?.category ?? "fitness";
  const freeText =
    intake?.goal && intake.goal.trim().length > 0
      ? intake.goal
      : "I want a small, steady week instead of an all-or-nothing one.";
  const language = user.locale.startsWith("pl") ? "pl" : "en";

  if (!existingIntent) {
    const { error: insertIntentError } = await supabase.from("intents").insert({
      user_id: user.id,
      week_id: week.id,
      category,
      free_text: freeText,
      timezone_band: timezoneBand,
      language,
    });

    if (insertIntentError) {
      throw insertIntentError;
    }
  }

  const { data: circle, error: circleError } = await supabase
    .from("circles")
    .insert({
      week_id: week.id,
      category,
      language,
      timezone_band: timezoneBand,
      member_count: 0,
      status: "active",
    })
    .select("*")
    .single();

  if (circleError) {
    throw circleError;
  }

  await ensureMembershipsAndMessages(circle.id, user);

  return circle.id;
}

async function getCircleReadClient(email: string) {
  const developerEmail = await getDeveloperEmailOverride();
  const adminClient = getSupabaseAdminClient();

  if (!adminClient) {
    throw new Error("Supabase admin client is not configured.");
  }

  if (developerEmail && developerEmail === normalizeEmail(email)) {
    return adminClient;
  }

  return adminClient;
}

export async function getMyCircleView(email: string): Promise<CircleViewModel> {
  const user = await ensureAppUser(email);
  const circleId = await ensureCircleForUser(user);
  await ensureMembershipsAndMessages(circleId, user);
  const supabase = await getCircleReadClient(email);
  const intake = await getLatestIntake(email);

  const { data: appUser, error: appUserError } = await supabase
    .from("app_users")
    .select("*")
    .eq("auth_credential", normalizeEmail(email))
    .maybeSingle<AppUserRow>();

  if (appUserError || !appUser) {
    throw appUserError ?? new Error("Could not load the signed-in member profile.");
  }

  const { data: memberships, error: membershipsError } = await supabase
    .from("memberships")
    .select("*")
    .eq("circle_id", circleId)
    .order("created_at", { ascending: true });

  if (membershipsError) {
    throw membershipsError;
  }

  const membershipRows = (memberships ?? []) as MembershipRow[];
  const userMembership = membershipRows.find((membership) => membership.user_id === appUser.id);

  if (!userMembership) {
    throw new Error("Signed-in user does not have access to this circle.");
  }

  const { data: circle, error: circleError } = await supabase
    .from("circles")
    .select("id, category")
    .eq("id", circleId)
    .single<CircleRow>();

  if (circleError) {
    throw circleError;
  }

  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select("*")
    .eq("circle_id", circleId)
    .eq("moderation_status", "clean")
    .order("created_at", { ascending: true });

  if (messagesError) {
    throw messagesError;
  }

  const membershipById = new Map(membershipRows.map((membership) => [membership.id, membership]));
  const displayNameByMembershipId = buildDisplayNameMap(membershipRows, appUser.id);
  const timeZone = intake?.timezone ?? user.timezone ?? "UTC";
  const todayKey = getIsoDateInTimeZone(new Date(), timeZone);
  const weekStart = intake?.week_start ?? getUpcomingWeekWindow(timeZone).weekStart;
  const weekEnd = intake?.week_end ?? getUpcomingWeekWindow(timeZone).weekEnd;
  const weekdayIndex = getWeekdayIndexForTimeZone(new Date(), timeZone);
  const postedTodayMembershipIds = new Set(
    (messages ?? [])
      .filter((message) => getIsoDateInTimeZone(new Date(message.created_at), timeZone) === todayKey)
      .map((message) => message.membership_id)
  );
  const membershipsWithPresence = membershipRows.map((membership) => ({
    ...membership,
    hasPostedToday: postedTodayMembershipIds.has(membership.id),
    isYou: membership.user_id === appUser.id,
  }));
  const checkedInTodayCount = membershipsWithPresence.filter((membership) => membership.hasPostedToday).length;
  const hasPostedToday = postedTodayMembershipIds.has(userMembership.id);
  const mappedMessages = (messages ?? []).map((message, index) => {
    const author = membershipById.get(message.membership_id);
    const tone: "blush" | "porcelain" = index % 2 === 0 ? "blush" : "porcelain";
    const previous = index > 0 ? (messages ?? [])[index - 1] as MessageRow : null;
    const groupedWithPrevious =
      previous != null &&
      new Date(message.created_at).getTime() - new Date(previous.created_at).getTime() < 45 * 60 * 1000;
    return {
      ...(message as MessageRow),
      authorName: displayNameByMembershipId.get(message.membership_id) ?? author?.pseudonym ?? "Hidden Bunny",
      accentColor: author?.accent_color ?? "#C75C2A",
      groupedWithPrevious,
      isOwn: message.membership_id === userMembership.id,
      relativeTime: formatMessageTime(message.created_at, timeZone),
      tone,
    };
  });

  return {
    category: circle.category.replaceAll("_", " "),
    checkedInTodayCount,
    dayName: weekdayNames[weekdayIndex],
    dayLabel: weekdayPrompts[weekdayIndex],
    dayNumber: getDayNumberInWeek(weekStart, timeZone),
    hasPostedToday,
    memberCount: membershipRows.length,
    memberships: membershipsWithPresence.map((membership) => ({
      ...membership,
      pseudonym: displayNameByMembershipId.get(membership.id) ?? membership.pseudonym,
    })),
    messages: mappedMessages,
    prompt: dailyPrompt,
    promptTitle: weekdayPromptTitles[weekdayIndex],
    userMembership,
    weekRangeLabel: formatWeekRangeLabel(weekStart, weekEnd),
  };
}

export async function postMessageToMyCircle(email: string, body: string) {
  const trimmed = body.trim();

  if (!trimmed) {
    return { ok: false, error: "Message cannot be empty." } as const;
  }

  if (trimmed.length > 2000) {
    return { ok: false, error: "Message is too long." } as const;
  }

  const user = await ensureAppUser(email);
  await ensureCircleForUser(user);
  const supabase = await getCircleReadClient(email);

  const { data: appUser, error: appUserError } = await supabase
    .from("app_users")
    .select("*")
    .eq("auth_credential", normalizeEmail(email))
    .maybeSingle<AppUserRow>();

  if (appUserError || !appUser) {
    return { ok: false, error: "Could not verify the signed-in member." } as const;
  }

  const { data: userMembership, error: membershipError } = await supabase
    .from("memberships")
    .select("*")
    .eq("user_id", appUser.id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<MembershipRow>();

  if (membershipError || !userMembership) {
    return { ok: false, error: "Could not find an active circle membership." } as const;
  }

  const { error } = await supabase.from("messages").insert({
    circle_id: userMembership.circle_id,
    membership_id: userMembership.id,
    body: trimmed,
    moderation_status: "clean",
  });

  if (error) {
    return { ok: false, error: "Message could not be sent right now." } as const;
  }

  revalidatePath("/my-circle");

  return { ok: true } as const;
}
