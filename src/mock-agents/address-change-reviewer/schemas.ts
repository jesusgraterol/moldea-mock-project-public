import { z } from "zod";

export const AddressChangeReviewerInputSchema = z.strictObject({
  reference: z.string().trim().min(1).max(64),
  snapshotTakenAt: z.iso.datetime({ offset: true }),
  facts: z.array(z.string().min(1)).max(32),
  dispatchState: z.enum(["not-packed", "packed", "handed-to-carrier"]),
});

export const AddressChangeReviewerOutputSchema = z.strictObject({
  reference: z.string(),
  summary: z.string().min(1),
  evidence: z.array(z.string()),
  unknowns: z.array(z.string()),
  requiresReview: z.literal(true),
  feasibility: z.enum(["reviewable", "unknown-after-handoff"]),
});
