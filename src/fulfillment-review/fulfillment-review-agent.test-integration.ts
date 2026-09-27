import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createFulfillmentReviewAgent } from './fulfillment-review-agent.ts';
import { previewFulfillmentReview } from './fulfillment-review-preview.ts';
import type { IFulfillmentReviewInvocation } from './types.ts';

test('fulfillment review loads only its dated evidence and attributes limits', async () => {
  let loaded: IFulfillmentReviewInvocation | undefined;
  const agent = createFulfillmentReviewAgent((invocation) => {
    loaded = invocation;
    return previewFulfillmentReview(invocation);
  });

  const review = await agent.invoke();

  assert.ok(loaded);
  assert.deepEqual(Object.keys(loaded).sort(), ['fulfillmentSource', 'instructions']);
  assert.match(loaded.instructions, /`fulfillment-review`/);
  assert.equal(loaded.fulfillmentSource.path, '/records/hs-214-fulfillment.md');
  assert.equal(review.audience, 'staff-only');
  assert.match(review.findings[0].text, /2026-09-26 snapshot/);
  assert.match(review.findings[0].text, /not establish current availability/);
  assert.deepEqual(review.findings[0].sources, ['/records/hs-214-fulfillment.md']);
  assert.match(review.openQuestions[0].text, /Confirm current availability/);
});

test('fulfillment review refuses changed evidence or instruction text', async () => {
  const agent = createFulfillmentReviewAgent((invocation) =>
    previewFulfillmentReview({
      ...invocation,
      fulfillmentSource: {
        ...invocation.fulfillmentSource,
        markdown: `${invocation.fulfillmentSource.markdown}\n`,
      },
    }),
  );
  await assert.rejects(agent.invoke(), /An HS-214 preview input changed/);

  const changedInstructionAgent = createFulfillmentReviewAgent((invocation) =>
    previewFulfillmentReview({ ...invocation, instructions: `${invocation.instructions}\n` }),
  );
  await assert.rejects(changedInstructionAgent.invoke(), /An HS-214 preview input changed/);
});
