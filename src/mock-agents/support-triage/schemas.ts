import { z } from "zod";

export const SupportTriageInputSchema = z.strictObject({
  reference: z.string().trim().min(1).max(64),
  snapshotTakenAt: z.iso.datetime({ offset: true }),
  facts: z.array(z.string().min(1)).max(32),
  intent: z.enum(["shipment", "return", "refund", "address", "product"]),
});

export const SupportTriageOutputSchema = z.strictObject({
  reference: z.string(),
  summary: z.string().min(1),
  evidence: z.array(z.string()),
  unknowns: z.array(z.string()),
  requiresReview: z.literal(true),
  route: z.enum(["shipment-explainer", "returns-guide", "refund-reviewer", "address-change-reviewer", "catalog-advisor"]),
});
