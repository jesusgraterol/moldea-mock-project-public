import { readRepositoryText } from "../../mock-runtime/agent.js";

/** Reads the canonical fixture instruction. */
export const loadOrderLookupInstruction = (): Promise<string> =>
  readRepositoryText("/moldea/agents/order-lookup/instruction.md");
