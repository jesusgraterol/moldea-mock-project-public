import { z } from "zod";

export const FraudScreenerInputSchema = z.strictObject({
  reference: z.string().trim().min(1).max(64),
  snapshotTakenAt: z.iso.datetime({ offset: true }),
  facts: z.array(z.string().min(1)).max(32),
  signals: z.array(z.string()).max(8),
});

export const FraudScreenerOutputSchema = z.strictObject({
  reference: z.string(),
  summary: z.string().min(1),
  evidence: z.array(z.string()),
  unknowns: z.array(z.string()),
  requiresReview: z.literal(true),
  riskBand: z.enum(["routine", "review", "insufficient-data"]),
});
