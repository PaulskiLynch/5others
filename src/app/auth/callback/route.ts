import { NextResponse, type NextRequest } from "next/server";

import { createSupabaseRouteClient } from "@/lib/supabase/route";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/my-circle";
  const { supabase, response } = createSupabaseRouteClient(request);

  if (!supabase) {
    return NextResponse.redirect(new URL("/sign-in?error=supabase_not_configured", request.url));
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      const errorUrl = new URL("/sign-in", request.url);
      errorUrl.searchParams.set("next", next);
      errorUrl.searchParams.set("error", error.message);
      return NextResponse.redirect(errorUrl);
    }
  }

  const redirectResponse = NextResponse.redirect(new URL(next, request.url));
  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });

  return redirectResponse;
}
