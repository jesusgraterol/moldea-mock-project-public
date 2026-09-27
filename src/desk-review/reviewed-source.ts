import { createHash } from 'node:crypto';

import type { IReviewSource } from './types.ts';

/**
 * Refuses to present fixed HS-214 wording after an instruction or source changes.
 * @param source The loaded instruction or checked-in source.
 * @param expectedPath The reviewed repository-logical path.
 * @param expectedSha256 The SHA-256 digest of the reviewed text.
 * @throws
 * - An HS-214 preview input changed and must be reviewed.
 */
export const assertReviewedSource = (
  source: IReviewSource,
  expectedPath: string,
  expectedSha256: string,
): void => {
  const actualSha256 = createHash('sha256').update(source.markdown).digest('hex');

  if (source.path !== expectedPath || actualSha256 !== expectedSha256) {
    throw new Error('An HS-214 preview input changed and must be reviewed.');
  }
};
