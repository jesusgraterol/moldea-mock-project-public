import { readFile } from "node:fs/promises";
import { AssistantError } from "./errors.js";

// Works from both src/ and the compiled dist/ directory, independently of cwd.
const instructionUrl = new URL("../moldea/agents/staff-assistant/instruction.md", import.meta.url);

export async function loadStaffInstruction(): Promise<string> {
  let instruction: string;
  try {
    instruction = await readFile(instructionUrl, "utf8");
  } catch {
    throw new AssistantError("INSTRUCTION_UNAVAILABLE", "Maintained instruction is unavailable; no answer was generated.");
  }
  if (!instruction.includes("`staff-assistant`") || !instruction.trim()) {
    throw new AssistantError("INSTRUCTION_INVALID", "Maintained instruction has no assistant identity; no answer was generated.");
  }
  return instruction;
}
