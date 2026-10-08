import { createMockAgent } from "../../mock-runtime/agent.js";
import { RefundReviewerInputSchema, RefundReviewerOutputSchema } from "./schemas.js";
import { loadRefundReviewerInstruction } from "./instructions.js";
import { provideFixtureVariables } from "./variables.js";
import { readPaymentSummaryTool } from "../../mock-tools/read-payment-summary.js";
import { previewRefundReviewTool } from "../../mock-tools/preview-refund-review.js";

export const registeredTools = [readPaymentSummaryTool, previewRefundReviewTool];
export const registeredSkills = [
  {
    "name": "policy-comparison",
    "path": "/fixtures/skills/policy-comparison/SKILL.md"
  },
  {
    "name": "money-formatting",
    "path": "/fixtures/skills/money-formatting/SKILL.md"
  }
];

/** Inert explorer example: canonical policy plus predetermined local output. */
export const refundReviewerAgent = createMockAgent({
  id: "refund-reviewer",
  inputSchema: RefundReviewerInputSchema,
  outputSchema: RefundReviewerOutputSchema,
  loadInstruction: loadRefundReviewerInstruction,
  variables: provideFixtureVariables,
  tools: registeredTools,
  skills: registeredSkills,
  exampleOutputPath: "/fixtures/explorer/agents/refund-reviewer/output.json",
});
