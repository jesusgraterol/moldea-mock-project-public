import { readRepositoryText } from "../../mock-runtime/agent.js";

/** Reads the canonical fixture instruction. */
export const loadStockWatcherInstruction = (): Promise<string> =>
  readRepositoryText("/moldea/agents/stock-watcher/instruction.md");
