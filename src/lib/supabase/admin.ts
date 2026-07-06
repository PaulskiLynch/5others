import { createClient } from "@supabase/supabase-js";

import { getSupabaseAdminEnv, hasSupabaseAdminEnv } from "@/lib/env";

export function getSupabaseAdminClient() {
  if (!hasSupabaseAdminEnv()) {
    return null;
  }

  const { url, serviceRoleKey } = getSupabaseAdminEnv();

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  });
}
