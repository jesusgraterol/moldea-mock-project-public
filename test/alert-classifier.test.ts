import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { classifyAlertBatch } from '../src/alert-classifier.ts';

const id301 = JSON.parse(readFileSync(new URL('../fixtures/id-301.json', import.meta.url), 'utf8'));

function fakeModel(answer, capture = []) {
  return {
    withStructuredOutput(schema) {
      assert.ok(schema);
      return {
        async invoke(messages) {
          capture.push(messages);
          return answer;
        },
      };
    },
  };
}

test('ID-301 keeps raw evidence, separates hypotheses, and requests engineer review', async () => {
  const calls = [];
  const result = await classifyAlertBatch(id301, fakeModel({
    reviewEventIds: ['P-771', 'P-772'],
    hypotheses: [{
      question: 'Could release 2.14 be related to these readings?',
      supportingEventIds: ['P-771', 'P-772'],
    }],
  }, calls));

  assert.deepEqual(result.rawEvents, id301.events);
  assert.deepEqual(result.observations.map((item) => item.eventId), ['P-771', 'P-772']);
  assert.deepEqual(result.observations.map((item) => item.aboveThreshold), [true, true]);
  assert.deepEqual(result.engineerReview, { recommended: true, eventIds: ['P-771', 'P-772'] });
  assert.equal(result.hypotheses[0].status, 'unverified');
  assert.deepEqual(result.missingEvidence, ['customer-impact count', 'database-health evidence']);
  assert.equal('page' in result, false);
  assert.equal('incidentStatus' in result, false);
  assert.match(calls[0][0].content, /engineers own those decisions/i);
  assert.match(calls[0][1].content, /P-771/);
  assert.match(calls[0][1].content, /P-772/);
});

test('rejects invented event IDs and model claims outside the review schema', async () => {
  await assert.rejects(
    classifyAlertBatch(id301, fakeModel({ reviewEventIds: ['P-999'], hypotheses: [] })),
    /raw event IDs/,
  );
  await assert.rejects(
    classifyAlertBatch(id301, fakeModel({ reviewEventIds: [], hypotheses: [], page: true })),
  );
});

test('requires hypotheses to remain questions tied to supplied events', async () => {
  await assert.rejects(
    classifyAlertBatch(id301, fakeModel({
      reviewEventIds: ['P-771'],
      hypotheses: [{ question: 'The deployment caused the spike.', supportingEventIds: ['P-771'] }],
    })),
    /phrased as questions/,
  );
});

test('rejects unknown latency units instead of making an unsafe comparison', async () => {
  const batch = structuredClone(id301);
  batch.events[1].unit = 'ticks';
  await assert.rejects(
    classifyAlertBatch(batch, fakeModel({ reviewEventIds: [], hypotheses: [] })),
    /Unsupported latency unit/,
  );
});
