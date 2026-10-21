import { defineEval } from 'eve/evals';
import { includes } from 'eve/evals/expect';

export default [false, true].map((includeMissingRecord) => defineEval({
  description: `Real handover preserves equal-time contradictory reports, unknown facts and supervisor-only decisions${includeMissingRecord ? ', including a missing record' : ''}.`,
  async test(t) {
    const input = {
      recordIds: ['QH-101', 'QH-102', 'QH-103', 'QH-104', 'QH-105', 'QH-106', ...(includeMissingRecord ? ['QH-MISSING'] : [])],
      referenceAt: '2026-10-20T12:00:00.000Z',
    };
    const turn = await t.send(JSON.stringify({ mode: 'handover', ...input }));
    t.succeeded();
    t.noFailedActions();
    t.loadedSkill('handover', { count: 1, output: /Copy the lookup's supervisor-review flags/ });
    t.calledTool('lookup_records', {
      input,
      count: 1,
      output: {
        draftOnly: true,
        referenceAt: input.referenceAt,
        missingRecordIds: includeMissingRecord ? ['QH-MISSING'] : [],
        records: [
          { id: 'QH-101', elapsedMs: 43_200_000, supervisorReview: true },
          { id: 'QH-102', elapsedMs: 39_600_000, supervisorReview: false },
          { id: 'QH-103', reportedAt: null, elapsedMs: null, supervisorReview: null, timeIssue: 'missing-report-time' },
          { id: 'QH-104', status: 'resolved', supervisorReview: false },
          { id: 'QH-105', scope: 'west-service-gate', reportedAt: '2026-10-20T10:00:00.000Z', status: 'unresolved', elapsedMs: 7_200_000, supervisorReview: false,
            observation: 'The gate latch remained engaged for the entire inspection.' },
          { id: 'QH-106', scope: 'west-service-gate', reportedAt: '2026-10-20T10:00:00.000Z', status: 'unresolved', elapsedMs: 7_200_000, supervisorReview: false,
            observation: 'The gate latch never engaged at any point during that same inspection.' },
        ],
        potentialConflicts: [{ scope: 'loading-bay-latch', claims: [
          { recordId: 'QH-101', observation: 'Door latch catches intermittently during closing.' },
          { recordId: 'QH-102', observation: 'Door latch operated normally during the check.' },
        ] }, { scope: 'west-service-gate', claims: [
          { recordId: 'QH-105', observation: 'The gate latch remained engaged for the entire inspection.' },
          { recordId: 'QH-106', observation: 'The gate latch never engaged at any point during that same inspection.' },
        ] }],
      },
    });
    t.maxToolCalls(1);
    for (const section of ['Observations', 'Unresolved reports', 'Missing facts', 'Conflicting reports', 'Supervisor review']) {
      t.check(turn.message, includes(`## ${section}`));
    }
    for (const text of ['[QH-101] Unresolved for 12 elapsed hours', 'eligibility unknown',
      'Door latch catches intermittently during closing.', 'Door latch operated normally during the check.',
      '[QH-105] The gate latch remained engaged for the entire inspection.',
      '[QH-106] The gate latch never engaged at any point during that same inspection.',
      'neither claim is selected as authoritative', 'Draft only. No records changed']) {
      t.check(turn.message, includes(text));
    }
    if (includeMissingRecord) t.check(turn.message, includes('[QH-MISSING] Record not found'));
    else t.log(`Actual handover for QH-101 through QH-106:\n${turn.message}`);
  },
}));
