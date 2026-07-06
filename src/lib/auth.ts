import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { auth, currentUser } from "@clerk/nextjs/server";

const DEV_AUTH_COOKIE = "fiveothers-dev-email";

export function isLocalDevAuthEnabled() {
  return process.env.NODE_ENV !== "production";
}

export async function getDeveloperEmailOverride() {
  if (!isLocalDevAuthEnabled()) {
    return null;
  }

  const cookieStore = await cookies();
  return cookieStore.get(DEV_AUTH_COOKIE)?.value ?? null;
}

export async function setDeveloperEmailOverride(email: string) {
  if (!isLocalDevAuthEnabled()) {
    return;
  }

  const cookieStore = await cookies();
  cookieStore.set(DEV_AUTH_COOKIE, email.trim().toLowerCase(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function clearDeveloperEmailOverride() {
  if (!isLocalDevAuthEnabled()) {
    return;
  }

  const cookieStore = await cookies();
  cookieStore.delete(DEV_AUTH_COOKIE);
}

export async function getAuthenticatedUserEmail() {
  const developerEmail = await getDeveloperEmailOverride();

  if (developerEmail) {
    return developerEmail;
  }

  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const user = await currentUser();

  return user?.primaryEmailAddress?.emailAddress?.toLowerCase() ?? null;
}

export async function requireAuthenticatedUserEmail() {
  const email = await getAuthenticatedUserEmail();

  if (!email) {
    redirect("/sign-in?next=/my-circle");
  }

  return email;
}

function getConfiguredAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireAdminUserEmail() {
  const email = await getAuthenticatedUserEmail();

  if (!email) {
    redirect("/sign-in?next=/admin");
  }

  const configuredAdminEmails = getConfiguredAdminEmails();

  if (configuredAdminEmails.length > 0 && !configuredAdminEmails.includes(email.toLowerCase())) {
    redirect("/sign-in?next=/admin&error=admin_only");
  }

  return email;
}
