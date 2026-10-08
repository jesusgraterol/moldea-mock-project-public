import { z } from "zod";

export const EscalationCoordinatorInputSchema = z.strictObject({
  reference: z.string().trim().min(1).max(64),
  snapshotTakenAt: z.iso.datetime({ offset: true }),
  facts: z.array(z.string().min(1)).max(32),
  priority: z.enum(["routine", "attention", "urgent"]),
});

export const EscalationCoordinatorOutputSchema = z.strictObject({
  reference: z.string(),
  summary: z.string().min(1),
  evidence: z.array(z.string()),
  unknowns: z.array(z.string()),
  requiresReview: z.literal(true),
  reviewQueue: z.enum(["shipping-review", "commerce-review", "support-lead"]),
});
