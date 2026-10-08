import { readRepositoryText } from "../../mock-runtime/agent.js";

/** Reads the canonical fixture instruction. */
export const loadOperationsReporterInstruction = (): Promise<string> =>
  readRepositoryText("/moldea/agents/operations-reporter/instruction.md");
