import { readRepositoryText } from "../../mock-runtime/agent.js";

/** Reads the canonical fixture instruction. */
export const loadCatalogAdvisorInstruction = (): Promise<string> =>
  readRepositoryText("/moldea/agents/catalog-advisor/instruction.md");
