import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { classifyAlertBatch } from '../src/alert-classifier.ts';
import { draftHandoffBrief } from '../src/handoff-brief.ts';

const id301 = JSON.parse(readFileSync(new URL('../fixtures/id-301.json', import.meta.url), 'utf8'));

function fakeModel(answer, calls = []) {
  return {
    withStructuredOutput(schema) {
      assert.ok(schema);
      return {
        async invoke(messages) {
          calls.push(messages);
          return answer;
        },
      };
    },
  };
}

async function classification() {
  return classifyAlertBatch(id301, fakeModel({
    reviewEventIds: ['P-771', 'P-772'],
    hypotheses: [{
      question: 'Could release 2.14 be related to these readings?',
      supportingEventIds: ['P-771', 'P-772'],
    }],
  }));
}

test('handoff uses classification and keeps source timeline separate from synopsis', async () => {
  const input = await classification();
  const calls = [];
  const brief = await draftHandoffBrief(input, fakeModel({
    synopsis: 'P-771 and P-772 exceed their supplied thresholds after the release; an engineer should review the signals and evidence gaps.',
  }, calls));

  assert.equal(brief.batchId, 'ID-301');
  assert.deepEqual(brief.sourceEvidence.timeline.map((item) => item.at), [
    '2026-09-27T09:08:00Z',
    '2026-09-27T09:12:00Z',
    '2026-09-27T09:14:00Z',
    '2026-09-27T09:16:00Z',
  ]);
  assert.deepEqual(brief.sourceEvidence.timeline.filter((item) => item.eventId).map((item) => item.eventId), ['P-771', 'P-772']);
  assert.deepEqual(brief.sourceEvidence.rawEvents, id301.events);
  assert.deepEqual(brief.sourceEvidence.observations, input.observations);
  assert.deepEqual(brief.sourceEvidence.evidenceGaps, ['customer-impact count', 'database-health evidence']);
  assert.deepEqual(brief.classification.engineerReview, input.engineerReview);
  assert.deepEqual(brief.classification.hypotheses, input.hypotheses);
  assert.equal(brief.humanReviewRequired, true);
  assert.equal('page' in brief, false);
  assert.equal('incidentStatus' in brief, false);
  assert.match(calls[0][0].content, /draft for an on-call engineer to review/i);
  assert.match(calls[0][1].content, /P-771/);
});

test('changing the synopsis does not change source evidence', async () => {
  const input = await classification();
  const first = await draftHandoffBrief(input, fakeModel({ synopsis: 'Review P-771 and P-772; impact remains unknown.' }));
  const second = await draftHandoffBrief(input, fakeModel({ synopsis: 'P-771 and P-772 need engineer review; cause remains unknown.' }));
  assert.deepEqual(first.sourceEvidence, second.sourceEvidence);
  assert.notEqual(first.modelDraft.synopsis, second.modelDraft.synopsis);
});

test('rejects a synopsis that loses a selected raw event ID', async () => {
  const input = await classification();
  await assert.rejects(
    draftHandoffBrief(input, fakeModel({ synopsis: 'P-771 needs review.' })),
    /cite each event/,
  );
});
