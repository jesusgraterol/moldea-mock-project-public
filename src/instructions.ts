import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

/** Canonical policy is loaded directly, not maintained as an inline copy. */
export async function loadReturnInstruction(): Promise<string> {
  return readFile(
    resolve(import.meta.dirname, '../moldea/agents/returns-assistant/instruction.md'),
    'utf8',
  );
}
