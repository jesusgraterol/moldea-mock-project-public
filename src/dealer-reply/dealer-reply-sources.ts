import { readFile } from 'node:fs/promises';

import type { IDealerReplyInvocation } from './types.ts';

const CASE_URL = new URL('../../records/hs-214.md', import.meta.url);
const PRODUCT_URL = new URL('../../catalog/hc-240.md', import.meta.url);

/**
 * Reads the checked-in case and product sheet without accepting arbitrary paths.
 * @returns The current source texts and their repository-logical paths.
 * @throws
 * - An HS-214 source is empty.
 */
export const loadDealerReplySources = async (): Promise<
  Pick<IDealerReplyInvocation, 'caseSource' | 'productSource'>
> => {
  const [caseMarkdown, productMarkdown] = await Promise.all([
    readFile(CASE_URL, 'utf8'),
    readFile(PRODUCT_URL, 'utf8'),
  ]);

  if (!caseMarkdown.trim() || !productMarkdown.trim()) {
    throw new Error('An HS-214 source is empty.');
  }

  return {
    caseSource: { path: '/records/hs-214.md', markdown: caseMarkdown },
    productSource: { path: '/catalog/hc-240.md', markdown: productMarkdown },
  };
};
