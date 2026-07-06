export const productDefinition =
  "Every Monday, 5others matches six anonymous people working on a similar change into one private circle for one week.";

export const primeDirective =
  "Every feature must serve encouragement and persistence. If it rewards attention, comparison, or performance, it is out of scope.";

export const antiFeatures = [
  "No public profiles or identity beyond a weekly pseudonym and color.",
  "No followers, friends, or persistent member graphs.",
  "No likes, leaderboards, streak competition, or view counts.",
  "No public feed, browsing, or circle discovery.",
  "No direct messages between members.",
  "No in-app sharing of real names, photos, or contact details.",
] as const;

export const launchCategories = [
  "fitness",
  "study",
  "recovery",
  "sobriety",
  "health_condition",
  "grief",
  "habit_change",
  "tough_week",
  "other",
] as const;

export type IntentCategory = (typeof launchCategories)[number];

export const launchCohorts = ["cardiobunny"] as const;
export type LaunchCohort = (typeof launchCohorts)[number];

export const ageRanges = ["18-29", "30-44", "45-59", "60+"] as const;
export type AgeRange = (typeof ageRanges)[number];

export const startingPoints = [
  "restarting",
  "building_consistency",
  "already_active",
] as const;
export type StartingPoint = (typeof startingPoints)[number];

export const supportStyles = [
  "gentle_accountability",
  "encouragement",
  "starting_over",
  "help_me_show_up",
] as const;
export type SupportStyle = (typeof supportStyles)[number];

export const preferredLanguages = ["en", "pl"] as const;
export type PreferredLanguage = (typeof preferredLanguages)[number];

export const fitnessGoals = [
  "weight_loss",
  "endurance",
  "general_health",
  "heart_health",
  "consistency",
] as const;
export type FitnessGoal = (typeof fitnessGoals)[number];

export const weeklyLifecycle = [
  {
    time: "Sunday 18:00",
    label: "Intent window opens",
    detail: "Members share what they want to work on next week."
  },
  {
    time: "Monday 00:00",
    label: "Matching runs",
    detail: "Circles form by language, timezone band, and category."
  },
  {
    time: "Monday to Sunday",
    label: "Circle week",
    detail: "Members check in, encourage each other, and keep going."
  },
  {
    time: "Sunday 12:00",
    label: "Closing ritual",
    detail: "Everyone gets prompted to leave one encouragement behind."
  },
  {
    time: "Sunday 23:59",
    label: "Circle closes",
    detail: "The week becomes read-only, then retires after the archive window."
  }
] as const;

export const phaseOneSlices = [
  "Email magic-link auth and a three-screen onboarding flow.",
  "Intent submission plus the weekly state machine and matching v1.",
  "A private circle view with thread, check-ins, pseudonyms, and urgent-help access.",
  "Contact-info filtering, reporting, and crisis detection from day one.",
  "An admin review queue for safety events, reports, and ban tools.",
] as const;

export const safetyPrinciples = [
  "Encouragement, not advice.",
  "Crisis pathways ship with v1, not later.",
  "Messages are filtered for contact-sharing and harmful content.",
  "Data stays minimal and time-bounded.",
] as const;

export type UserStatus = "active" | "paused" | "suspended" | "deleted";
export type WeekStatus = "matching" | "active" | "closing" | "closed";
export type CircleStatus = "forming" | "active" | "closed" | "dissolved_early";
export type MembershipStatus = "active" | "left" | "removed";
export type ModerationStatus = "clean" | "flagged" | "removed";
export type Mood = "struggling" | "okay" | "good";

export type User = {
  id: string;
  authCredential: string;
  createdAt: string;
  timezone: string;
  locale: string;
  status: UserStatus;
  safetyFlags: string[];
  strikesCount: number;
};

export type Intent = {
  id: string;
  userId: string;
  weekId: string;
  category: IntentCategory;
  freeText?: string;
  createdAt: string;
};

export type Week = {
  id: string;
  startDate: string;
  endDate: string;
  status: WeekStatus;
};

export type Circle = {
  id: string;
  weekId: string;
  category: IntentCategory;
  memberCount: number;
  status: CircleStatus;
  createdAt: string;
  closedAt?: string;
};

export type Membership = {
  id: string;
  circleId: string;
  userId: string;
  pseudonym: string;
  status: MembershipStatus;
};

export type Message = {
  id: string;
  circleId: string;
  membershipId: string;
  body: string;
  createdAt: string;
  moderationStatus: ModerationStatus;
};

export type CheckIn = {
  id: string;
  circleId: string;
  membershipId: string;
  day: string;
  mood?: Mood;
  note?: string;
  createdAt: string;
};
