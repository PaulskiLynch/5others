"use client";

import { createClient } from "@supabase/supabase-js";

import { getSupabaseBrowserEnv, hasSupabaseBrowserEnv } from "@/lib/env";

export function getSupabaseBrowserClient() {
  if (!hasSupabaseBrowserEnv()) {
    return null;
  }

  const { url, anonKey } = getSupabaseBrowserEnv();
  return createClient(url, anonKey);
}
