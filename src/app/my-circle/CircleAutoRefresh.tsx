"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

type CircleAutoRefreshProps = {
  intervalMs?: number;
};

export function CircleAutoRefresh({ intervalMs = 12000 }: CircleAutoRefreshProps) {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        router.refresh();
      }
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [intervalMs, router]);

  return null;
}
