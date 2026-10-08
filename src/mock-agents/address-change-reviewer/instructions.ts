import { readRepositoryText } from "../../mock-runtime/agent.js";

/** Reads the canonical fixture instruction. */
export const loadAddressChangeReviewerInstruction = (): Promise<string> =>
  readRepositoryText("/moldea/agents/address-change-reviewer/instruction.md");
