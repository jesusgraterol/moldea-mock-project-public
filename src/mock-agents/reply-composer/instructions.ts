import { readRepositoryText } from "../../mock-runtime/agent.js";

/** Reads the declared exact fixture mirror. */
export const loadReplyComposerInstruction = (): Promise<string> =>
  readRepositoryText("/fixtures/instruction-mirrors/reply-composer.md");
