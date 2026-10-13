import { z } from "zod";

export const QuestionSchema = z.strictObject({
  question: z.string().min(1).max(2000).regex(/\S/, "Question must not be blank"),
});

export const ToolRecordSchema = z.strictObject({
  id: z.string().regex(/^LL-\d{3}$/),
  name: z.string().min(1).max(80),
  availability: z.enum(["available", "on_loan", "unknown"]),
});

export const CitedRecordSchema = ToolRecordSchema.extend({
  source: z.string().regex(/^data\/tools\.json#LL-\d{3}$/),
});

export const LookupInputSchema = z.strictObject({
  query: z.string().min(1).max(120).regex(/\S/, "Query must not be blank")
    .describe("Fictional tool ID or name; exact matches take precedence over name substrings."),
});

export const LookupResultSchema = z.strictObject({
  status: z.enum(["found", "ambiguous", "not_found"]),
  records: z.array(CitedRecordSchema),
  source: z.literal("data/tools.json"),
});

export const ModelResponseSchema = z.strictObject({
  requestType: z.enum(["tool_question", "policy_question", "outside_scope"]),
  lookupStatus: z.enum(["found", "ambiguous", "not_found", "not_requested"]),
  records: z.array(CitedRecordSchema),
  loanPeriodDays: z.literal(7),
  policySource: z.literal("moldea/agents/staff-assistant/instruction.md"),
  missingFacts: z.array(z.enum(["tool_identity", "availability", "due_date", "policy_details"])),
  staffApprovalRequired: z.literal(true),
  action: z.literal("information_only"),
  safetyAssessment: z.literal("not_assessed"),
});

export type ToolRecord = z.infer<typeof ToolRecordSchema>;
export type LookupResult = z.infer<typeof LookupResultSchema>;
export type StaffResponse = z.infer<typeof ModelResponseSchema>;
