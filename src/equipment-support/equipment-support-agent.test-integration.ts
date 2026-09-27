import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createEquipmentSupportAgent } from './equipment-support-agent.ts';
import { previewEquipmentSupport } from './equipment-support-preview.ts';
import type { IEquipmentSupportInvocation } from './types.ts';

test('equipment review loads only equipment sources and attributes its findings', async () => {
  let loaded: IEquipmentSupportInvocation | undefined;
  const agent = createEquipmentSupportAgent((invocation) => {
    loaded = invocation;
    return previewEquipmentSupport(invocation);
  });

  const review = await agent.invoke();

  assert.ok(loaded);
  assert.deepEqual(Object.keys(loaded).sort(), ['caseSource', 'instructions', 'productSource']);
  assert.match(loaded.instructions, /`equipment-support`/);
  assert.equal(loaded.caseSource.path, '/records/hs-214.md');
  assert.equal(loaded.productSource.path, '/catalog/hc-240.md');
  assert.equal(review.audience, 'staff-only');
  assert.equal(review.dealerSafeFacts.doorRevision, 'Rev B');
  assert.match(review.findings[0].text, /GS-240-B/);
  assert.deepEqual(review.findings[0].sources, ['/records/hs-214.md', '/catalog/hc-240.md']);
  assert.match(review.openQuestions[0].text, /measured cabinet temperature/);
});

test('equipment review refuses changed source or instruction text', async () => {
  const agent = createEquipmentSupportAgent((invocation) =>
    previewEquipmentSupport({
      ...invocation,
      caseSource: { ...invocation.caseSource, markdown: `${invocation.caseSource.markdown}\n` },
    }),
  );
  await assert.rejects(agent.invoke(), /An HS-214 preview input changed/);

  const changedInstructionAgent = createEquipmentSupportAgent((invocation) =>
    previewEquipmentSupport({ ...invocation, instructions: `${invocation.instructions}\n` }),
  );
  await assert.rejects(changedInstructionAgent.invoke(), /An HS-214 preview input changed/);

  const changedProductAgent = createEquipmentSupportAgent((invocation) =>
    previewEquipmentSupport({
      ...invocation,
      productSource: { ...invocation.productSource, markdown: `${invocation.productSource.markdown}\n` },
    }),
  );
  await assert.rejects(changedProductAgent.invoke(), /An HS-214 preview input changed/);
});
