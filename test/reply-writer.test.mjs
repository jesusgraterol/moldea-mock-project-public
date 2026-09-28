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
