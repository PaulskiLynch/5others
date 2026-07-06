import { z } from "zod";

import {
  ageRanges,
  launchCategories,
  launchCohorts,
  preferredLanguages,
  startingPoints,
  supportStyles,
} from "@/lib/product";

export const intakeRequestSchema = z.object({
  email: z.email().max(160),
  timezone: z.string().min(1).max(80),
  locale: z.string().min(2).max(20),
  preferredLanguage: z.enum(preferredLanguages),
  cohort: z.enum(launchCohorts),
  category: z.enum(launchCategories),
  ageRange: z.enum(ageRanges),
  startingPoint: z.enum(startingPoints),
  supportStyle: z.enum(supportStyles),
  goal: z.string().trim().min(12).max(240),
  acceptsSafety: z.literal(true),
  acceptsNoDmRule: z.literal(true),
});

export type IntakeRequestInput = z.infer<typeof intakeRequestSchema>;
