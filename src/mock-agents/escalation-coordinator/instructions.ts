import { readRepositoryText } from "../../mock-runtime/agent.js";

/** Reads the declared exact fixture mirror. */
export const loadEscalationCoordinatorInstruction = (): Promise<string> =>
  readRepositoryText("/fixtures/instruction-mirrors/escalation-coordinator.md");
