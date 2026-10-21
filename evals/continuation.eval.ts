import { defineEval, type EveEvalContext, type EveEvalTurn } from 'eve/evals';
import { equals, includes } from 'eve/evals/expect';

function checkHealthyTurn(t: EveEvalContext, turn: EveEvalTurn): void {
  const failures = turn.events.flatMap((event) =>
    event.type === 'step.failed' || event.type === 'turn.failed' || event.type === 'session.failed'
      ? [{ type: event.type, code: event.data.code, message: event.data.message }]
      : []);
  t.log(`Continuation session=${turn.sessionId} status=${turn.status} failures=${JSON.stringify(failures)}`);
  // A recoverable failed turn can still end at session.waiting. Check both.
  t.check(turn.status, equals('waiting'));
  turn.event('turn.completed', { count: 1 });
  turn.notEvent('step.failed');
  turn.notEvent('turn.failed');
  turn.notEvent('session.failed');
  turn.notEvent('turn.cancelled');
  turn.succeeded();
  turn.noFailedActions();
}

export default [defineEval({
  description: 'Same-session lookups must use current selections and supplied timestamps, including null and repeated inputs.',
  async test(t) {
    const session = await t.session();
    const cases = [
      { input: { recordIds: ['QH-101'], referenceAt: '2026-10-20T12:00:00.000Z' },
        record: { id: 'QH-101', elapsedMs: 43_200_000, supervisorReview: true, timeIssue: null } },
      { input: { recordIds: ['QH-103'], referenceAt: null },
        record: { id: 'QH-103', reportedAt: null, elapsedMs: null, supervisorReview: null, timeIssue: 'missing-both-times' } },
      { input: { recordIds: ['QH-101'], referenceAt: '2026-10-20T12:00:00.000Z' },
        record: { id: 'QH-101', elapsedMs: 43_200_000, supervisorReview: true, timeIssue: null } },
      { input: { recordIds: ['QH-101'], referenceAt: '2026-10-20T13:00:00.000Z' },
        record: { id: 'QH-101', elapsedMs: 46_800_000, supervisorReview: true, timeIssue: null } },
    ];
    for (const { input, record } of cases) {
      const turn = await session.send(JSON.stringify({ mode: 'lookup', ...input }));
      checkHealthyTurn(t, turn);
      t.check(turn.sessionId, equals(session.sessionId));
      turn.calledTool('lookup_records', {
        input, output: { referenceAt: input.referenceAt, records: [record], missingRecordIds: [] }, count: 1,
      });
      turn.maxToolCalls(1);
      turn.loadedSkill('handover', { count: 0 });
      t.check(turn.message, includes(`"id":"${record.id}"`));
      t.check(turn.message, includes(`"referenceAt":${JSON.stringify(input.referenceAt)}`));
    }
    t.calledTool('lookup_records', { count: cases.length });
    t.succeeded();
  },
}), defineEval({
  description: 'One session continues from lookup to handover, repeated handover and back to lookup without stale results or procedure leakage.',
  async test(t) {
    const session = await t.session();
    const cases = [
      { mode: 'lookup', input: { recordIds: ['QH-105', 'QH-106'], referenceAt: '2026-10-20T12:00:00.000Z' },
        records: [{ id: 'QH-105', elapsedMs: 7_200_000, supervisorReview: false }, { id: 'QH-106', elapsedMs: 7_200_000, supervisorReview: false }] },
      { mode: 'handover', input: { recordIds: ['QH-103'], referenceAt: null },
        records: [{ id: 'QH-103', reportedAt: null, elapsedMs: null, supervisorReview: null, timeIssue: 'missing-both-times' }] },
      { mode: 'handover', input: { recordIds: ['QH-105', 'QH-106'], referenceAt: '2026-10-20T12:00:00.000Z' },
        records: [{ id: 'QH-105', elapsedMs: 7_200_000, supervisorReview: false }, { id: 'QH-106', elapsedMs: 7_200_000, supervisorReview: false }] },
      // Exact repeat: neither the old lookup nor the old procedure action can satisfy this turn.
      { mode: 'handover', input: { recordIds: ['QH-105', 'QH-106'], referenceAt: '2026-10-20T12:00:00.000Z' },
        records: [{ id: 'QH-105', elapsedMs: 7_200_000, supervisorReview: false }, { id: 'QH-106', elapsedMs: 7_200_000, supervisorReview: false }] },
      { mode: 'lookup', input: { recordIds: ['QH-101'], referenceAt: '2026-10-20T13:00:00.000Z' },
        records: [{ id: 'QH-101', elapsedMs: 46_800_000, supervisorReview: true }] },
    ];
    for (const { mode, input, records } of cases) {
      const turn = await session.send(JSON.stringify({ mode, ...input }));
      checkHealthyTurn(t, turn);
      t.check(turn.sessionId, equals(session.sessionId));
      turn.calledTool('lookup_records', { input, output: { referenceAt: input.referenceAt, records }, count: 1 });
      turn.maxToolCalls(1);
      turn.loadedSkill('handover', mode === 'handover'
        ? { count: 1, output: /Copy the lookup's supervisor-review flags/ }
        : { count: 0 });
      if (mode === 'handover') {
        t.check(turn.message, includes(`Reference timestamp: ${input.referenceAt ?? 'unknown'}`));
        if (input.referenceAt === null) {
          t.check(turn.message, includes('[QH-103] missing-both-times; elapsed age unknown; supervisor-review eligibility unknown.'));
        } else {
          t.check(turn.message, includes('[QH-105] The gate latch remained engaged for the entire inspection.'));
          t.check(turn.message, includes('[QH-106] The gate latch never engaged at any point during that same inspection.'));
          t.check(turn.message, includes('neither claim is selected as authoritative'));
        }
      } else {
        t.check(turn.message, includes(`"referenceAt":${JSON.stringify(input.referenceAt)}`));
        t.check(turn.message, includes(`"id":"${records[0]!.id}"`));
      }
    }
    for (const prompt of ['Hello', 'Close QH-101, assign staff and execute repairs.']) {
      const turn = await session.send(prompt);
      checkHealthyTurn(t, turn);
      turn.usedNoTools();
      turn.loadedSkill('handover', { count: 0 });
      t.check(turn.message, includes(prompt === 'Hello' ? 'Hello.' : 'I cannot close incidents'));
    }
    t.calledTool('lookup_records', { count: cases.length });
    t.loadedSkill('handover', { count: 3 });
    t.notEvent('step.failed');
    t.notEvent('turn.failed');
    t.succeeded();
  },
})];
