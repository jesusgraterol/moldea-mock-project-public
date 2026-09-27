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
  assert.match(invocations[0].caseSource.markdown, /fitted door as Rev B/);
  assert.equal(invocations[0].productSource.path, '/catalog/hc-240.md');
  assert.match(invocations[0].productSource.markdown, /Rev B channel/);
  assert.equal(invocations[0].warrantySource.path, '/policies/parts-warranty.md');
  assert.match(invocations[0].warrantySource.markdown, /manufacturing defects/);
  assert.equal(result.mode, 'deterministic-preview');
  assert.match(result.dealerDraft, /Rev B door channel/);
  assert.match(result.dealerDraft, /measured cabinet temperature/);
  assert.match(result.dealerDraft, /close-up photo of the torn area/);
  assert.doesNotMatch(result.dealerDraft, /GS-240-[AB]/);
  assert.doesNotMatch(result.dealerDraft, /warranty|stock|business days|delivery/i);
  assert.match(result.verificationNotes.fit.join(' '), /Rev B to GS-240-B/);
  assert.match(result.verificationNotes.symptomFollowUp.join(' '), /not evidence of what caused/);
  assert.match(result.verificationNotes.warrantyScreening.join(' '), /within the 12-month/);
  assert.match(result.verificationNotes.warrantyScreening.join(' '), /2026-01-12/);
  assert.match(result.verificationNotes.warrantyScreening.join(' '), /Neither cause is established/);
  assert.match(result.verificationNotes.shipmentQuestions.join(' '), /2026-09-26 snapshot listed 4/);
  assert.match(result.verificationNotes.shipmentQuestions.join(' '), /0 reserved for HS-214/);
  assert.match(result.verificationNotes.shipmentQuestions.join(' '), /after dispatch/);
  assert.match(result.verificationNotes.staffApproval.join(' '), /approve the dealer response/);
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
  {
    name: 'warranty policy',
    change: (invocation) => ({
      ...invocation,
      warrantySource: {
        ...invocation.warrantySource,
        markdown: `${invocation.warrantySource.markdown}\n`,
      },
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
