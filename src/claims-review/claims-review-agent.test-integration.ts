import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createClaimsReviewAgent } from './claims-review-agent.ts';
import { previewClaimsReview } from './claims-review-preview.ts';
import type { IClaimsReviewInvocation } from './types.ts';

test('claims review loads only claims sources and keeps screening staff-only', async () => {
  let loaded: IClaimsReviewInvocation | undefined;
  const agent = createClaimsReviewAgent((invocation) => {
    loaded = invocation;
    return previewClaimsReview(invocation);
  });

  const review = await agent.invoke();

  assert.ok(loaded);
  assert.deepEqual(Object.keys(loaded).sort(), ['claimSource', 'instructions', 'policySource']);
  assert.match(loaded.instructions, /`claims-review`/);
  assert.equal(loaded.claimSource.path, '/records/hs-214-claims.md');
  assert.equal(loaded.policySource.path, '/policies/parts-warranty.md');
  assert.equal(review.audience, 'staff-only');
  assert.match(review.findings[0].text, /HC-240 door gasket/);
  assert.match(review.findings[0].text, /applicable 18-month reporting period/);
  assert.match(
    review.findings[1].text,
    /neither a manufacturing defect nor documented cleaning damage/,
  );
  assert.deepEqual(review.findings[0].sources, [
    '/records/hs-214-claims.md',
    '/policies/parts-warranty.md',
  ]);
  assert.match(review.openQuestions[0].text, /claims desk and support manager decide/);
});

test('claims review refuses changed evidence or instruction text', async () => {
  const agent = createClaimsReviewAgent((invocation) =>
    previewClaimsReview({
      ...invocation,
      claimSource: { ...invocation.claimSource, markdown: `${invocation.claimSource.markdown}\n` },
    }),
  );
  await assert.rejects(agent.invoke(), /An HS-214 preview input changed/);

  const changedInstructionAgent = createClaimsReviewAgent((invocation) =>
    previewClaimsReview({ ...invocation, instructions: `${invocation.instructions}\n` }),
  );
  await assert.rejects(changedInstructionAgent.invoke(), /An HS-214 preview input changed/);

  const changedPolicyAgent = createClaimsReviewAgent((invocation) =>
    previewClaimsReview({
      ...invocation,
      policySource: { ...invocation.policySource, markdown: `${invocation.policySource.markdown}\n` },
    }),
  );
  await assert.rejects(changedPolicyAgent.invoke(), /An HS-214 preview input changed/);
});
