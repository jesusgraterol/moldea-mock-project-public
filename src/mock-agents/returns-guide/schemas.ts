import { z } from "zod";

export const ReturnsGuideInputSchema = z.strictObject({
  reference: z.string().trim().min(1).max(64),
  snapshotTakenAt: z.iso.datetime({ offset: true }),
  facts: z.array(z.string().min(1)).max(32),
  productCondition: z.enum(["unopened", "damaged", "personalized", "unknown"]),
});

export const ReturnsGuideOutputSchema = z.strictObject({
  reference: z.string(),
  summary: z.string().min(1),
  evidence: z.array(z.string()),
  unknowns: z.array(z.string()),
  requiresReview: z.literal(true),
  reviewOutcome: z.enum(["staff-review", "missing-evidence", "outside-fixture-policy"]),
});
