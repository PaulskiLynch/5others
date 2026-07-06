import { headers } from "next/headers";

export type BrandKey = "default" | "cardiobunny";

export function detectBrandFromHost(host: string) {
  const normalizedHost = host.trim().toLowerCase();

  if (
    normalizedHost.startsWith("cardiobunny.") ||
    normalizedHost.startsWith("www.cardiobunny.")
  ) {
    return "cardiobunny" as const;
  }

  return "default" as const;
}

export async function getRequestBrandKey(): Promise<BrandKey> {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "";
  return detectBrandFromHost(host);
}
