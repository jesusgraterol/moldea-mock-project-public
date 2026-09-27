import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createDealerReplyAgent } from './dealer-reply-agent.ts';
import { previewDealerReply } from './dealer-reply-preview.ts';
import type { IDealerReplyInvocation } from './types.ts';

test('HS-214 invocation loads the canonical instruction and sources for the staff preview', async () => {
  const invocations: IDealerReplyInvocation[] = [];
  const agent = createDealerReplyAgent(async (invocation) => {
    invocations.push(invocation);
    return previewDealerReply(invocation);
  });

  const result = await agent.invoke();

  assert.equal(invocations.length, 1);
  assert.match(invocations[0].instructions, /`dealer-reply`/);
  assert.equal(invocations[0].caseSource.path, '/records/hs-214.md');
  assert.match(invocations[0].caseSource.markdown, /Ridgeway Foodservice/);
  assert.equal(invocations[0].productSource.path, '/catalog/hc-240.md');
  assert.match(invocations[0].productSource.markdown, /Rev B channel/);
  assert.equal(result.mode, 'deterministic-preview');
  assert.match(result.dealerDraft, /clear photo of the door label or gasket channel/);
  assert.match(result.dealerDraft, /measured cabinet temperature/);
  assert.doesNotMatch(result.dealerDraft, /GS-240-[AB]/);
  assert.match(result.verificationNotes.join(' '), /GS-240-A and Rev B to GS-240-B/);
});

const changedInputs: Array<{
  name: string;
  change: (invocation: IDealerReplyInvocation) => IDealerReplyInvocation;
}> = [
  {
    name: 'canonical instruction',
    change: (invocation) => ({ ...invocation, instructions: `${invocation.instructions}\n` }),
  },
  {
    name: 'case record',
    change: (invocation) => ({
      ...invocation,
      caseSource: { ...invocation.caseSource, markdown: `${invocation.caseSource.markdown}\n` },
    }),
  },
  {
    name: 'product sheet',
    change: (invocation) => ({
      ...invocation,
      productSource: { ...invocation.productSource, markdown: `${invocation.productSource.markdown}\n` },
    }),
  },
];

for (const changedInput of changedInputs) {
  test(`HS-214 preview rejects a changed ${changedInput.name}`, async () => {
    const agent = createDealerReplyAgent((invocation) =>
      previewDealerReply(changedInput.change(invocation)),
    );

    await assert.rejects(agent.invoke(), /An HS-214 preview input changed and must be reviewed/);
  });
}
