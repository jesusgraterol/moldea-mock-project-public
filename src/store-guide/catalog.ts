import { readFile } from 'node:fs/promises';

import { tool } from 'ai';
import { z } from 'zod';

// the first guide capability is scoped to SG-101's 16-inch laptop
const LAPTOP_SIZE_INCHES = 16;
const CATALOG_URL = new URL('../../records/catalog.md', import.meta.url);

type ICatalogBag = {
  sku: string;
  product: string;
  capacity: string;
  laptopSleeve: string;
  weight: string;
  weatherDetail: string;
  otherDetail: string;
  displayPrice: string;
};

// the tool takes no model-selected filters; the SG-101 size is fixed by this source
export const LookupBagsInputSchema = z.strictObject({});

/** Reads the local snapshot and selects products by their listed laptop-sleeve size. */
export const lookupBags = async (): Promise<{
  source: string;
  matchingBags: ICatalogBag[];
  excludedBags: ICatalogBag[];
  catalogNotes: string;
}> => {
  const catalogMarkdown = await readFile(CATALOG_URL, 'utf8');
  const productRows = catalogMarkdown
    .split(/\r?\n/)
    .filter((line) => /^\| `[^`]+` \|/.test(line));

  if (productRows.length === 0) {
    throw new Error('The local bag catalog has no product rows.');
  }

  const matchingBags: ICatalogBag[] = [];
  const excludedBags: ICatalogBag[] = [];

  for (const row of productRows) {
    const cells = row.split('|').slice(1, -1).map((cell) => cell.trim());
    const sleeveSize = /^Up to (\d+) inches$/.exec(cells[3] ?? '');

    if (cells.length !== 8 || sleeveSize === null) {
      throw new Error('The local bag catalog contains an unsupported product row.');
    }

    const bag: ICatalogBag = {
      sku: cells[0].slice(1, -1),
      product: cells[1],
      capacity: cells[2],
      laptopSleeve: cells[3],
      weight: cells[4],
      weatherDetail: cells[5],
      otherDetail: cells[6],
      displayPrice: cells[7],
    };

    (Number(sleeveSize[1]) >= LAPTOP_SIZE_INCHES ? matchingBags : excludedBags).push(bag);
  }

  const catalogNotes = catalogMarkdown.split(/\r?\n\r?\n/).at(-1)?.trim() ?? '';

  return {
    source: 'records/catalog.md',
    matchingBags,
    excludedBags,
    catalogNotes,
  };
};

// read-only catalog capability exposed to the model
export const lookupBagsTool = tool({
  description:
    'Look up local catalog bags for SG-101, including 16-inch sleeve matches, exclusions, and catalog caveats.',
  inputSchema: LookupBagsInputSchema,
  execute: lookupBags,
});
