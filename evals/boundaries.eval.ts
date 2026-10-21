import { defineEval } from 'eve/evals';
import { includes } from 'eve/evals/expect';

const cases = [
  { referenceAt: '2026-10-20T11:59:59.999Z', elapsedMs: 43_199_999, supervisorReview: false, timeIssue: null },
  { referenceAt: '2026-10-20T12:00:00.001Z', elapsedMs: 43_200_001, supervisorReview: true, timeIssue: null },
  { referenceAt: null, elapsedMs: null, supervisorReview: null, timeIssue: 'missing-reference-time' },
  { referenceAt: '2026-10-19T23:00:00.000Z', elapsedMs: null, supervisorReview: null, timeIssue: 'report-after-reference' },
] as const;

export default cases.map(({ referenceAt, ...expected }) => defineEval({
  description: `Timestamp boundary: ${referenceAt ?? 'unknown reference'}`,
  async test(t) {
    const input = { recordIds: ['QH-101'], referenceAt };
    const turn = await t.send(JSON.stringify({ mode: 'lookup', ...input }));
    t.succeeded();
    t.noFailedActions();
    t.calledTool('lookup_records', { input, output: { referenceAt, records: [{ id: 'QH-101', ...expected }] }, count: 1 });
    t.maxToolCalls(1);
    t.check(turn.message, includes(`"supervisorReview":${expected.supervisorReview}`));
    t.loadedSkill('handover', { count: 0 });
  },
}));
