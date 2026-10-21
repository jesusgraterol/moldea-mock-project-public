import { z } from "zod";

export const UtcTimestampSchema = z.iso.datetime();
const IdentifierSchema = z.string().min(1).max(120).regex(/^\S+$/);
const QuantitySchema = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);

export const RequestSchema = z.strictObject({
  id: IdentifierSchema,
  itemId: IdentifierSchema,
  quantity: QuantitySchema.positive(),
  referenceAt: UtcTimestampSchema,
  neededAt: UtcTimestampSchema,
});

export const InventoryLookupInputSchema = z.strictObject({
  itemId: IdentifierSchema,
});

export const InventoryRecordSchema = z.strictObject({
  id: IdentifierSchema,
  name: z.string().trim().min(1),
  availability: z.enum(["available", "unavailable", "unknown"]),
  quantityAvailable: QuantitySchema.nullable().default(null),
  observedAt: UtcTimestampSchema.nullable().default(null),
});

export const InventoryLookupOutputSchema = InventoryRecordSchema.nullable();

export const InventorySchema = z.array(InventoryRecordSchema).superRefine((records, context) => {
  const seen = new Set<string>();
  records.forEach((record, index) => {
    if (seen.has(record.id)) {
      context.addIssue({ code: "custom", path: [index, "id"], message: "Duplicate inventory record ID." });
    }
    seen.add(record.id);
  });
});

export const RecommendationActionSchema = z.enum([
  "review-for-dispatch",
  "do-not-dispatch",
  "verify-inventory",
]);

export const HandoffSchema = z.strictObject({
  requestId: IdentifierSchema,
  recommendation: z.strictObject({
    action: RecommendationActionSchema,
    summary: z.string().trim().min(1).max(1200),
  }),
  supportingInventoryRecordIds: z.array(IdentifierSchema).max(1),
  missingFacts: z.array(z.string().trim().min(1).max(300)).max(8),
  urgency: z.enum(["urgent", "routine"]),
  requiresStaffApproval: z.literal(true),
}).meta({ description: "An equipment-request recommendation for staff review, never a dispatch authorization." });

export const HandoffFactsSchema = HandoffSchema.omit({ recommendation: true }).extend({
  recommendationAction: RecommendationActionSchema,
});

export type EquipmentRequest = z.infer<typeof RequestSchema>;
export type InventoryRecord = z.infer<typeof InventoryRecordSchema>;
export type Handoff = z.infer<typeof HandoffSchema>;
export type HandoffFacts = z.infer<typeof HandoffFactsSchema>;

export function parseBoundary<Schema extends z.ZodType>(schema: Schema, value: unknown, label: string): z.infer<Schema> {
  const result = schema.safeParse(value);
  if (!result.success) {
    throw new Error(`Invalid ${label}: ${z.prettifyError(result.error)}`);
  }
  return result.data;
}
