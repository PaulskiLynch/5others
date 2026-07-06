import { NextResponse } from "next/server";

import { runCircleReadyNotifications } from "@/lib/circle-ready";
import { getTodayUtcDate } from "@/lib/notifications";

export const runtime = "nodejs";

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return true;
  }

  const authorization = request.headers.get("authorization");
  return authorization === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const runDate = new URL(request.url).searchParams.get("date") ?? getTodayUtcDate();
    return NextResponse.json(await runCircleReadyNotifications(runDate));
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown notification failure",
      },
      { status: 500 }
    );
  }
}
