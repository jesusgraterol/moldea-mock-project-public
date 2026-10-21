import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export async function loadDispatchInstruction(): Promise<string> {
  const instruction = await readFile(
    resolve(import.meta.dirname, "..", "moldea", "agents", "equipment-handoff", "instruction.md"), "utf8",
  );
  if (!instruction.trim()) throw new Error("The equipment-handoff instruction is empty.");
  return instruction;
}
