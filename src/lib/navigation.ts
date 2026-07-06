export function isSafeInternalPath(path: string | null | undefined) {
  return typeof path === "string" && path.startsWith("/") && !path.startsWith("//");
}

export function withNext(path: string, next: string) {
  const url = new URL(path, "http://local");
  url.searchParams.set("next", next);
  return `${url.pathname}${url.search}`;
}
