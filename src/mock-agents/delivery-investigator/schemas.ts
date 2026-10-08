import { z } from "zod";

export const DeliveryInvestigatorInputSchema = z.strictObject({
  reference: z.string().trim().min(1).max(64),
  snapshotTakenAt: z.iso.datetime({ offset: true }),
  facts: z.array(z.string().min(1)).max(32),
  estimatedDeliveryDate: z.iso.date().nullable(),
});

export const DeliveryInvestigatorOutputSchema = z.strictObject({
  reference: z.string(),
  summary: z.string().min(1),
  evidence: z.array(z.string()),
  unknowns: z.array(z.string()),
  requiresReview: z.literal(true),
  reviewReason: z.enum(["estimate-passed", "carrier-exception", "missing-evidence"]),
});
