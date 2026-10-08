import { createMockAgent } from "../../mock-runtime/agent.js";
import { AddressChangeReviewerInputSchema, AddressChangeReviewerOutputSchema } from "./schemas.js";
import { loadAddressChangeReviewerInstruction } from "./instructions.js";
import { provideFixtureVariables } from "./variables.js";
import { readDispatchStateTool } from "../../mock-tools/read-dispatch-state.js";

export const registeredTools = [readDispatchStateTool];
export const registeredSkills = [];

/** Inert explorer example: canonical policy plus predetermined local output. */
export const addressChangeReviewerAgent = createMockAgent({
  id: "address-change-reviewer",
  inputSchema: AddressChangeReviewerInputSchema,
  outputSchema: AddressChangeReviewerOutputSchema,
  loadInstruction: loadAddressChangeReviewerInstruction,
  variables: provideFixtureVariables,
  tools: registeredTools,
  skills: registeredSkills,
  exampleOutputPath: "/fixtures/explorer/agents/address-change-reviewer/output.json",
});
