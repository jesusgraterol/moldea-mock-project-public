import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildReplyPreview } from '../src/reply-writer.mjs';

const packet = JSON.parse(await readFile(new URL('../dist/case.json', import.meta.url), 'utf8'));

test('reply preview uses desk handoffs and keeps commitments pending', () => {
  const reviews = structuredClone(packet.reviews);
  reviews[0].handoff.statement = 'Equipment desk handoff changed for review.';
  const reply = buildReplyPreview(reviews);
  const body = reply.paragraphs.join(' ');
  assert.match(body, /Equipment desk handoff changed for review/);
  assert.doesNotMatch(body, /GS-240-B|three to five business days|warranty is approved/i);
  assert.match(reply.status, /manager approval required/i);
});

test('reply preview requires all three desks', () => {
  assert.throws(() => buildReplyPreview(packet.reviews.filter((review) => review.id !== 'claims')), /Missing claims desk handoff/);
});

test('claims review reflects the gasket window without approving the claim', () => {
  const claims = packet.reviews.find((review) => review.id === 'claims');
  assert.match(claims.findings[0].text, /18-month reporting period/);
  assert.match(claims.findings[0].text, /not claim eligibility/);
  assert.equal(claims.state, 'Assessment open');
  assert.match(claims.handoff.statement, /coverage has not been confirmed/);
  assert.doesNotMatch(packet.reply.paragraphs.join(' '), /18.month|claim approved|shipping confirmed/i);
  assert.match(packet.reply.status, /manager approval required/);
});
