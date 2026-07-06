import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseBrowserEnv, hasSupabaseBrowserEnv } from "@/lib/env";

export function createSupabaseRouteClient(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!hasSupabaseBrowserEnv()) {
    return { supabase: null, response };
  }

  const { url, anonKey } = getSupabaseBrowserEnv();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  return { supabase, response };
}
