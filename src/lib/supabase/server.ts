import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabaseBrowserEnv, hasSupabaseBrowserEnv } from "@/lib/env";

export async function getSupabaseServerClient() {
  if (!hasSupabaseBrowserEnv()) {
    return null;
  }

  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseBrowserEnv();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server components cannot always set cookies during render.
        }
      },
    },
  });
}
