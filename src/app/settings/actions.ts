"use server";

import { redirect } from "next/navigation";

import { requireAuthenticatedUserEmail } from "@/lib/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function leaveCurrentCircleAction() {
  const email = await requireAuthenticatedUserEmail();
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase admin client is not configured.");
  }

  const { data: appUser, error: appUserError } = await supabase
    .from("app_users")
    .select("id")
    .eq("auth_credential", normalizeEmail(email))
    .maybeSingle<{ id: string }>();

  if (appUserError || !appUser) {
    throw appUserError ?? new Error("Could not find the signed-in member.");
  }

  const { data: membership, error: membershipError } = await supabase
    .from("memberships")
    .select("id")
    .eq("user_id", appUser.id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<{ id: string }>();

  if (membershipError) {
    throw membershipError;
  }

  if (membership) {
    const { error: updateError } = await supabase
      .from("memberships")
      .update({ status: "left" })
      .eq("id", membership.id);

    if (updateError) {
      throw updateError;
    }
  }

  redirect("/week-close");
}
