import { readRepositoryText } from "../../mock-runtime/agent.js";

/** Reads the canonical fixture instruction. */
export const loadFraudScreenerInstruction = (): Promise<string> =>
  readRepositoryText("/moldea/agents/fraud-screener/instruction.md");
