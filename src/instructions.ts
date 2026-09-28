import { readFileSync } from 'node:fs';

/** Loads the single source of durable product-copy instructions. */
export const loadProductCopyInstruction = (): string =>
  readFileSync(
    new URL('../moldea/agents/product-copy-drafter/instruction.md', import.meta.url),
    'utf8',
  );
