import { readFileSync } from 'node:fs';

import { generateText } from 'ai';

import { lookupBags, type ICatalogBag } from '../catalog.js';

// exact catalog fields returned beside the draft for staff review
export type IComparisonCardResult = {
  card: string;
  facts: {
    source: string;
    canal22: ICatalogBag;
    ridge26: ICatalogBag;
    catalogNotes: string;
  };
};

/** Loads the staff-card instruction from its canonical moldea file. */
export const loadComparisonCardInstruction = (): string =>
  readFileSync(new URL('../../../moldea/agents/comparison-card/instruction.md', import.meta.url), 'utf8');

/** Drafts one staff-review card from the two named products in the local catalog. */
export const runComparisonCard = async (): Promise<IComparisonCardResult> => {
  const catalog = await lookupBags();
  const canal22 = catalog.matchingBags.find((bag) => bag.sku === 'CANAL-22');
  const ridge26 = catalog.matchingBags.find((bag) => bag.sku === 'RIDGE-26');

  if (!canal22 || !ridge26) {
    throw new Error('Both comparison products must have listed 16-inch laptop sleeves.');
  }

  const facts = {
    source: catalog.source,
    canal22,
    ridge26,
    catalogNotes: catalog.catalogNotes,
  };
  const result = await generateText({
    model: 'openai/gpt-5.4',
    instructions: loadComparisonCardInstruction(),
    prompt: `Draft a staff-review comparison card from these catalog facts:\n${JSON.stringify(facts)}`,
    maxRetries: 0,
  });

  if (result.text.trim() === '') {
    throw new Error('The comparison card was empty.');
  }

  return { card: result.text, facts };
};
