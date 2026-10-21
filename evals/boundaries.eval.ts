import { defineEval } from 'eve/evals';
import { equals, includes } from 'eve/evals/expect';

const cases = [
  { referenceAt: '2026-10-20T07:59:59.999Z', elapsedMs: 28_799_999, supervisorReview: false, timeIssue: null },
  { referenceAt: '2026-10-20T08:00:00.000Z', elapsedMs: 28_800_000, supervisorReview: true, timeIssue: null },
  { referenceAt: '2026-10-20T08:00:00.001Z', elapsedMs: 28_800_001, supervisorReview: true, timeIssue: null },
  { referenceAt: null, elapsedMs: null, supervisorReview: null, timeIssue: 'missing-reference-time' },
  { referenceAt: '2026-10-19T23:00:00.000Z', elapsedMs: null, supervisorReview: null, timeIssue: 'report-after-reference' },
] as const;

export default (['lookup', 'handover'] as const).flatMap((mode) => cases.map(({ referenceAt, ...expected }) => defineEval({
  description: `Inclusive 8-hour ${mode} boundary: ${referenceAt ?? 'unknown reference'}`,
  async test(t) {
    const input = { recordIds: ['QH-101'], referenceAt };
    const turn = await t.send(JSON.stringify({ mode, ...input }));
    t.succeeded();
    t.noFailedActions();
    t.check(turn.status, equals('waiting'));
    turn.event('turn.completed', { count: 1 });
    turn.notEvent('step.failed');
    turn.notEvent('turn.failed');
    turn.notEvent('session.failed');
    turn.notEvent('turn.cancelled');
    t.calledTool('lookup_records', { input, output: { referenceAt, records: [{ id: 'QH-101', ...expected }] }, count: 1 });
    t.maxToolCalls(1);
    if (mode === 'lookup') {
      t.check(turn.message, includes(`"supervisorReview":${expected.supervisorReview}`));
      t.loadedSkill('handover', { count: 0 });
    } else {
      t.loadedSkill('handover', { count: 1, output: /Copy the lookup's supervisor-review flags/ });
      t.check(turn.message, includes(`Reference timestamp: ${referenceAt ?? 'unknown'}`));
      t.check(turn.message?.includes('[QH-101] Unresolved for'), equals(expected.supervisorReview === true));
      if (expected.timeIssue !== null) t.check(turn.message, includes(`${expected.timeIssue}; elapsed age unknown; supervisor-review eligibility unknown.`));
    }
    t.log(`${mode}: referenceAt=${referenceAt ?? 'unknown'}, elapsedMs=${expected.elapsedMs ?? 'unknown'}, supervisorReview=${expected.supervisorReview ?? 'unknown'}`);
  },
})));
