import { z } from "zod";

export const RefundReviewerInputSchema = z.strictObject({
  reference: z.string().trim().min(1).max(64),
  snapshotTakenAt: z.iso.datetime({ offset: true }),
  facts: z.array(z.string().min(1)).max(32),
  amountMinor: z.number().int().nonnegative(),
  currency: z.enum(["USD", "EUR"]),
});

export const RefundReviewerOutputSchema = z.strictObject({
  reference: z.string(),
  summary: z.string().min(1),
  evidence: z.array(z.string()),
  unknowns: z.array(z.string()),
  requiresReview: z.literal(true),
  recommendation: z.enum(["review-eligibility", "request-evidence", "refer-to-lead"]),
});
