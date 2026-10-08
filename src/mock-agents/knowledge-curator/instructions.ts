import { readRepositoryText } from "../../mock-runtime/agent.js";

/** Reads the canonical fixture instruction. */
export const loadKnowledgeCuratorInstruction = (): Promise<string> =>
  readRepositoryText("/moldea/agents/knowledge-curator/instruction.md");
