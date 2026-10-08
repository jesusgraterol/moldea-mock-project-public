import { z } from "zod";

export const OrderLookupInputSchema = z.strictObject({
  reference: z.string().trim().min(1).max(64),
  snapshotTakenAt: z.iso.datetime({ offset: true }),
  facts: z.array(z.string().min(1)).max(32),
  orderReference: z.string().min(1),
});

export const OrderLookupOutputSchema = z.strictObject({
  reference: z.string(),
  summary: z.string().min(1),
  evidence: z.array(z.string()),
  unknowns: z.array(z.string()),
  requiresReview: z.literal(true),
  orderState: z.enum(["paid", "packed", "handed-to-carrier", "unknown"]),
});
