import { readRepositoryText } from "../../mock-runtime/agent.js";

/** Reads the declared exact fixture mirror. */
export const loadRefundReviewerInstruction = (): Promise<string> =>
  readRepositoryText("/fixtures/instruction-mirrors/refund-reviewer.md");
