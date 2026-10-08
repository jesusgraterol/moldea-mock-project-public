import { readRepositoryText } from "../../mock-runtime/agent.js";

/** Reads the canonical fixture instruction. */
export const loadQualityAuditorInstruction = (): Promise<string> =>
  readRepositoryText("/moldea/agents/quality-auditor/instruction.md");
