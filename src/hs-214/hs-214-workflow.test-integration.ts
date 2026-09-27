import assert from 'node:assert/strict';
import { test } from 'node:test';

import { runHs214Preview } from './hs-214-workflow.ts';

test('HS-214 workflow combines three independent attributed reviews before the dealer draft', async () => {
  const packet = await runHs214Preview();

  assert.equal(packet.deskReviews.equipment.desk, 'equipment-support');
  assert.equal(packet.deskReviews.claims.desk, 'claims-review');
  assert.equal(packet.deskReviews.fulfillment.desk, 'fulfillment-review');
  assert.ok(
    Object.values(packet.deskReviews).every(
      (review) =>
        review.audience === 'staff-only' &&
        [...review.findings, ...review.openQuestions].every((note) => note.sources.length > 0),
    ),
  );
  assert.match(packet.deskReviews.equipment.findings[0].text, /GS-240-B/);
  assert.match(packet.deskReviews.claims.findings[0].text, /applicable 18-month reporting period/);
  assert.match(packet.deskReviews.claims.findings[0].text, /not claim approval/);
  assert.match(packet.deskReviews.fulfillment.findings[1].text, /not a dispatch date/);
  assert.doesNotMatch(
    packet.dealerDraft,
    /GS-240-B|claim|warranty|18.month|2026-09-26|business days/i,
  );
});
