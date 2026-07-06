import { getSupabaseAdminClient } from "@/lib/supabase/admin";

type IntakeAdminRow = {
  id: string;
  email: string;
  preferred_language: string;
  age_range: string;
  starting_point: string;
  fitness_goal: string | null;
  week_start: string;
  created_at: string;
};

type DeliveryAdminRow = {
  id: string;
  email: string;
  notification_type: string;
  week_start: string;
  status: string;
  provider: string;
  created_at: string;
};

type CircleAdminRow = {
  id: string;
  category: string;
  language: string;
  member_count: number;
  status: string;
  created_at: string;
  weeks: Array<{
    start_at: string;
  }> | null;
};

export type AdminDashboardData = {
  summary: {
    intakeCount: number;
    waitingCount: number;
    liveCircleCount: number;
    activeMembershipCount: number;
    notificationSentCount: number;
    notificationPreviewCount: number;
    notificationFailedCount: number;
  };
  recentIntakes: IntakeAdminRow[];
  recentNotifications: DeliveryAdminRow[];
  activeCircles: CircleAdminRow[];
};

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase admin client is not configured.");
  }

  const today = new Date().toISOString().slice(0, 10);

  const [
    intakeCountResult,
    waitingCountResult,
    circleCountResult,
    membershipCountResult,
    sentCountResult,
    previewCountResult,
    failedCountResult,
    recentIntakesResult,
    recentNotificationsResult,
    activeCirclesResult,
  ] = await Promise.all([
    supabase.from("pilot_intake_requests").select("*", { count: "exact", head: true }),
    supabase
      .from("pilot_intake_requests")
      .select("*", { count: "exact", head: true })
      .gte("week_start", today),
    supabase.from("circles").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("memberships").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase
      .from("notification_deliveries")
      .select("*", { count: "exact", head: true })
      .eq("notification_type", "circle_ready")
      .eq("status", "sent"),
    supabase
      .from("notification_deliveries")
      .select("*", { count: "exact", head: true })
      .eq("notification_type", "circle_ready")
      .eq("status", "preview"),
    supabase
      .from("notification_deliveries")
      .select("*", { count: "exact", head: true })
      .eq("notification_type", "circle_ready")
      .eq("status", "failed"),
    supabase
      .from("pilot_intake_requests")
      .select("id, email, preferred_language, age_range, starting_point, fitness_goal, week_start, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("notification_deliveries")
      .select("id, email, notification_type, week_start, status, provider, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("circles")
      .select("id, category, language, member_count, status, created_at, weeks(start_at)")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const firstError = [
    intakeCountResult.error,
    waitingCountResult.error,
    circleCountResult.error,
    membershipCountResult.error,
    sentCountResult.error,
    previewCountResult.error,
    failedCountResult.error,
    recentIntakesResult.error,
    recentNotificationsResult.error,
    activeCirclesResult.error,
  ].find(Boolean);

  if (firstError) {
    throw firstError;
  }

  return {
    summary: {
      intakeCount: intakeCountResult.count ?? 0,
      waitingCount: waitingCountResult.count ?? 0,
      liveCircleCount: circleCountResult.count ?? 0,
      activeMembershipCount: membershipCountResult.count ?? 0,
      notificationSentCount: sentCountResult.count ?? 0,
      notificationPreviewCount: previewCountResult.count ?? 0,
      notificationFailedCount: failedCountResult.count ?? 0,
    },
    recentIntakes: (recentIntakesResult.data ?? []) as IntakeAdminRow[],
    recentNotifications: (recentNotificationsResult.data ?? []) as DeliveryAdminRow[],
    activeCircles: (activeCirclesResult.data ?? []) as CircleAdminRow[],
  };
}
