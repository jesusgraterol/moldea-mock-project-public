import { defineEval } from 'eve/evals';
import { includes } from 'eve/evals/expect';

export default defineEval({
  description: 'Real procedure loading and record lookup preserve the inclusive threshold, unknown facts and both conflicting claims.',
  async test(t) {
    const input = { recordIds: ['QH-101', 'QH-102', 'QH-103', 'QH-104', 'QH-MISSING'], referenceAt: '2026-10-20T12:00:00.000Z' };
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
        missingRecordIds: ['QH-MISSING'],
        records: [
          { id: 'QH-101', elapsedMs: 43_200_000, supervisorReview: true },
          { id: 'QH-102', elapsedMs: 39_600_000, supervisorReview: false },
          { id: 'QH-103', reportedAt: null, elapsedMs: null, supervisorReview: null, timeIssue: 'missing-report-time' },
          { id: 'QH-104', status: 'resolved', supervisorReview: false },
        ],
        potentialConflicts: [{ scope: 'loading-bay-latch', claims: [
          { recordId: 'QH-101', observation: 'Door latch catches intermittently during closing.' },
          { recordId: 'QH-102', observation: 'Door latch operated normally during the check.' },
        ] }],
      },
    });
    t.maxToolCalls(1);
    for (const section of ['Observations', 'Unresolved reports', 'Missing facts', 'Conflicting reports', 'Supervisor review']) {
      t.check(turn.message, includes(`## ${section}`));
    }
    for (const text of ['[QH-101] Unresolved for 12 elapsed hours', 'eligibility unknown', '[QH-MISSING] Record not found',
      'Door latch catches intermittently during closing.', 'Door latch operated normally during the check.',
      'neither claim is selected as authoritative', 'Draft only. No records changed']) {
      t.check(turn.message, includes(text));
    }
  },
});
