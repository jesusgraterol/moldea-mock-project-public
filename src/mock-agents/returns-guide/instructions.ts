import { readRepositoryText } from "../../mock-runtime/agent.js";

/** Reads the canonical fixture instruction. */
export const loadReturnsGuideInstruction = (): Promise<string> =>
  readRepositoryText("/moldea/agents/returns-guide/instruction.md");
