import { readRepositoryText } from "../../mock-runtime/agent.js";

/** Reads the canonical fixture instruction. */
export const loadAccessibilityEditorInstruction = (): Promise<string> =>
  readRepositoryText("/moldea/agents/accessibility-editor/instruction.md");
