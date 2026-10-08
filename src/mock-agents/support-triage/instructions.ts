import { readRepositoryText } from "../../mock-runtime/agent.js";

/** Reads the declared exact fixture mirror. */
export const loadSupportTriageInstruction = (): Promise<string> =>
  readRepositoryText("/fixtures/instruction-mirrors/support-triage.md");
