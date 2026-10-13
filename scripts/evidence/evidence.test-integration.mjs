import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync, gzipSync } from 'node:zlib';
import { afterEach, test } from 'node:test';

const script = join(dirname(fileURLToPath(import.meta.url)), 'evidence.mjs');
const temporaryRoots = [];
const sessionId = '0199c0b1-63da-73a1-b532-4e161922ea2f';

afterEach(async () => {
  await Promise.all(temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

const command = (executable, args, cwd) => {
  const result = spawnSync(executable, args, { cwd, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
};

const git = (root, ...args) => command('git', args, root);
const sha256 = (content) => createHash('sha256').update(content).digest('hex');
const unknown = (reason) => ({ state: 'unknown', reason });
const writeJson = async (path, record) => writeFile(path, `${JSON.stringify(record, null, 2)}\n`);

const setup = async ({ model = 'gpt-6.1-sol', runId = 'synthetic' } = {}) => {
  const root = join(tmpdir(), `moldea-verify-${randomUUID()}`);
  await mkdir(root);
  temporaryRoots.push(root);
  git(root, 'init', '-b', 'main');
  git(root, 'config', 'user.name', 'Evidence Test');
  git(root, 'config', 'user.email', 'evidence@example.test');
  await writeFile(join(root, 'changed.txt'), 'original\n');
  await writeFile(join(root, 'deleted.txt'), 'remove me\n');
  await writeFile(join(root, 'README.md'), '# Original project\n');
  await mkdir(join(root, '.agents', 'skills', 'moldea'), { recursive: true });
  await writeFile(join(root, '.agents', 'skills', 'moldea', 'SKILL.md'), '# Original skill\n');
  const basePaths = ['changed.txt', 'deleted.txt', 'README.md', '.agents/skills/moldea/SKILL.md'];
  git(root, 'add', '--', ...basePaths);
  git(root, 'commit', '-m', 'test base', '--', ...basePaths);
  const baseCommit = git(root, 'rev-parse', 'HEAD');
  git(root, 'branch', 'fixture_one_01');
  await mkdir(join(root, 'evidence', 'scenarios'), { recursive: true });
  await writeFile(join(root, 'evidence', 'scenarios', 'example.md'), '# Example\n');
  git(root, 'add', '--', 'evidence/scenarios/example.md');
  git(root, 'commit', '-m', 'test scenario', '--', 'evidence/scenarios/example.md');
  const scenarioCommit = git(root, 'rev-parse', 'HEAD');
  git(root, 'switch', 'fixture_one_01');
  await writeFile(join(root, 'changed.txt'), 'actor result\n');
  git(root, 'add', '--', 'changed.txt');
  git(root, 'commit', '-m', 'test actor result', '--', 'changed.txt');
  const finalCommit = git(root, 'rev-parse', 'HEAD');
  git(root, 'switch', 'main');

  const runDirectory = join(root, 'evidence', 'runs', runId);
  await mkdir(join(runDirectory, 'attempts'), { recursive: true });
  const assetRoot = join(root, 'downloads');
  await mkdir(join(assetRoot, 'synthetic'), { recursive: true });
  const native = join(root, 'native.jsonl');
  const rules = join(root, 'rules.json');
  const events = [
    { type: 'session_meta', timestamp: '2026-09-27T00:00:00Z', payload: {
      id: sessionId, cli_version: 'test-host',
    } },
    { type: 'turn_context', timestamp: '2026-09-27T00:00:01Z', payload: {
      model, effort: 'xhigh', root_turn_id: 'turn-1',
    } },
    { type: 'response_item', timestamp: '2026-09-27T00:00:02Z', payload: {
      type: 'message', role: 'user', content: [{ type: 'input_text', text: 'Build the example.' }],
    } },
  ];
  await writeFile(native, `${events.map((event) => JSON.stringify(event)).join('\n')}\n`);
  await writeJson(rules, { includeBaseInstructions: false, rules: [] });
  command(process.execPath, [script, 'capture', '--session', native, '--redactions', rules,
    '--output-root', join(assetRoot, 'synthetic'), '--name', 'session.jsonl.gz'], root);
  const metadata = JSON.parse(await readFile(join(assetRoot, 'synthetic', 'session.jsonl.gz.meta.json'), 'utf8'));
  const asset = {
    kind: 'session', tag: 'synthetic', name: 'session.jsonl.gz',
    sizeBytes: metadata.asset.sizeBytes, sha256: metadata.asset.sha256,
    mediaType: metadata.asset.mediaType, sessionId,
    firstEventOrdinal: metadata.firstEventOrdinal,
    lastEventOrdinal: metadata.lastEventOrdinal,
  };
  const identityLog = [
    'core-release: test-core sha256:test',
    'cli-release: test-cli sha256:test',
    'skill-release: test-release sha256:test',
    'turn-1: skill=test-release hash=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa cli=test-cli core=test-core adapters=none',
    '',
  ].join('\n');
  await writeFile(join(assetRoot, 'synthetic', 'identities.txt'), identityLog);
  const identityAsset = {
    kind: 'log', tag: 'synthetic', name: 'identities.txt',
    sizeBytes: Buffer.byteLength(identityLog), sha256: sha256(identityLog),
    mediaType: 'text/plain', sessionId: null, firstEventOrdinal: null,
    lastEventOrdinal: null,
  };
  const identitySource = (locator) => ({ tag: 'synthetic', name: 'identities.txt', locator });
  const attemptPath = join(runDirectory, 'attempts', 'one.json');
  const runPath = join(runDirectory, 'run.json');
  const indexPath = join(root, 'evidence', 'index.json');
  const runRelativePath = `evidence/runs/${runId}/run.json`;
  const attemptRelativePath = `evidence/runs/${runId}/attempts/one.json`;
  const attempt = {
    formatVersion: 1, runId, scenarioId: 'example', attemptId: 'one',
    branch: 'fixture_one_01', baseCommit, finalCommit, lastDurableCommit: finalCommit,
    scenarioDefinition: { path: 'evidence/scenarios/example.md', commit: scenarioCommit },
    observedSummary: 'Synthetic example completed.', actorOutcome: 'concluded',
    outcomeReason: null, evidenceStatus: 'complete', reviewStatus: 'pending', review: null,
    sessions: [{ id: sessionId, hostVersion: 'test-host', turns: [{
      eventOrdinal: 1, requestedModel: model, requestedEffort: 'xhigh',
      effectiveModel: model, effectiveEffort: 'xhigh', deviation: false,
    }] }],
    requests: [{ id: 'request-one', ordinal: 1, kind: 'initial', text: 'Build the example.',
      sessionId, eventOrdinal: 2, beforeCommit: baseCommit, afterCommit: finalCommit,
      observedResult: 'Example source changed.', redactionIds: [] }],
    ignoredDeveloperEvents: [],
    checks: [{ kind: 'manual', description: 'privacy review', inputCommit: finalCommit,
      result: 'passed', coveredArtifacts: ['evidence/index.json', runRelativePath,
        attemptRelativePath, 'evidence/scenarios/example.md',
        `git/${baseCommit}/${finalCommit}`, 'synthetic/session.jsonl.gz',
        'synthetic/identities.txt'], asset: null }],
    installations: [{ sessionId, eventOrdinal: 1, source: identitySource('turn-1'),
      skill: { ref: 'test-release', contentHash: 'a'.repeat(64) },
      cli: { version: 'test-cli', integrity: unknown('Synthetic local test.') },
      core: { version: 'test-core', integrity: unknown('Synthetic local test.') }, adapters: [],
    }],
    skillRelease: 'test-release', assets: [asset, identityAsset], interventions: [], failures: [],
    redactions: [], recovery: null, predecessorAttemptId: null, limitations: [],
  };
  const run = {
    formatVersion: 1, runId, date: '2026-09-27',
    summary: 'Synthetic evidence verification.',
    expectedActor: { model, effort: 'xhigh' }, prerequisites: [
      { component: 'cli', version: 'test-cli', integrity: 'sha256:test',
        source: identitySource('cli-release') },
      { component: 'skill', version: 'test-release', integrity: 'sha256:test',
        source: identitySource('skill-release') },
    ],
    attempts: [attemptRelativePath], evidenceStatus: 'complete', reviewStatus: 'pending',
    review: null, limitations: [],
  };
  const index = { formatVersion: 1, runs: [{ runId,
    manifestPath: runRelativePath, summary: run.summary,
    evidenceStatus: run.evidenceStatus, reviewStatus: run.reviewStatus }] };
  const save = async () => {
    await writeJson(attemptPath, attempt);
    await writeJson(runPath, run);
    index.runs[0].evidenceStatus = run.evidenceStatus;
    index.runs[0].reviewStatus = run.reviewStatus;
    await writeJson(indexPath, index);
  };
  const verify = () => spawnSync(process.execPath, [script, 'verify', '--run', runRelativePath,
    '--asset-root', assetRoot, '--repo-root', root], { cwd: root, encoding: 'utf8' });
  await save();
  return { root, assetRoot, attempt, run, save, verify, baseCommit, finalCommit,
    identitySource, identityLog };
};

const appendUserMessage = async (fixture) => {
  const assetPath = join(fixture.assetRoot, 'synthetic', 'session.jsonl.gz');
  const original = gunzipSync(await readFile(assetPath)).toString('utf8');
  const nextOrdinal = fixture.attempt.assets[0].lastEventOrdinal + 1;
  const event = { ordinal: nextOrdinal, timestamp: '2026-09-27T00:00:03Z',
    redactionIds: [], kind: 'message', payload: { role: 'user',
      content: [{ type: 'input_text', text: 'Build the example.' }] } };
  const compressed = gzipSync(`${original}${JSON.stringify(event)}\n`);
  await writeFile(assetPath, compressed);
  fixture.attempt.assets[0].sizeBytes = compressed.length;
  fixture.attempt.assets[0].sha256 = sha256(compressed);
  fixture.attempt.assets[0].lastEventOrdinal = nextOrdinal;
  return nextOrdinal;
};

const appendTurn = async (fixture, composition) => {
  const asset = fixture.attempt.assets[0];
  const assetPath = join(fixture.assetRoot, asset.tag, asset.name);
  const original = gunzipSync(await readFile(assetPath)).toString('utf8');
  const ordinal = asset.lastEventOrdinal + 1;
  const settings = { ...fixture.attempt.sessions[0].turns[0], eventOrdinal: ordinal };
  const requestOrdinal = fixture.attempt.requests.length + 1;
  const text = 'Continue the example.';
  const events = [
    { ordinal, timestamp: '2026-09-27T00:01:00Z', kind: 'turn', redactionIds: [],
      payload: { rootTurnId: 'turn-' + requestOrdinal, model: settings.effectiveModel,
        effort: settings.effectiveEffort } },
    { ordinal: ordinal + 1, timestamp: '2026-09-27T00:01:01Z', kind: 'message',
      redactionIds: [], payload: { role: 'user', content: [{ type: 'input_text', text }] } },
  ];
  const compressed = gzipSync(original + events.map((event) => JSON.stringify(event)).join('\n') + '\n');
  await writeFile(assetPath, compressed);
  asset.sizeBytes = compressed.length;
  asset.sha256 = sha256(compressed);
  asset.lastEventOrdinal = ordinal + 1;
  fixture.attempt.sessions[0].turns.push(settings);
  fixture.attempt.requests.push({ id: 'request-' + requestOrdinal, ordinal: requestOrdinal,
    kind: 'follow-up', text, sessionId, eventOrdinal: ordinal + 1,
    beforeCommit: fixture.finalCommit, afterCommit: fixture.finalCommit,
    observedResult: 'Continued the example.', redactionIds: [] });
  const installation = { ...structuredClone(composition), sessionId, eventOrdinal: ordinal,
    source: fixture.identitySource('turn-' + requestOrdinal) };
  fixture.attempt.installations.push(installation);
  fixture.identityLog += 'turn-' + requestOrdinal + ': ' + JSON.stringify(installation) + '\n';
  const log = fixture.attempt.assets[1];
  await writeFile(join(fixture.assetRoot, log.tag, log.name), fixture.identityLog);
  log.sizeBytes = Buffer.byteLength(fixture.identityLog);
  log.sha256 = sha256(fixture.identityLog);
  await fixture.save();
};

test('verify follows run-declared actor settings and preserves deviations and unknown evidence', async () => {
  const current = await setup();
  assert.equal(current.verify().status, 0);

  current.run.expectedActor.model = 'gpt-6-sol';
  await current.save();
  assert.match(current.verify().stderr, /inconsistent effective settings/i);
  current.attempt.sessions[0].turns[0].deviation = true;
  await current.save();
  assert.equal(current.verify().status, 0);

  const declared = await setup({ model: 'gpt-6-sol' });
  assert.equal(declared.verify().status, 0);
  declared.run.expectedActor = unknown('Settings were not recorded.');
  await declared.save();
  assert.match(declared.verify().stderr, /required durable evidence/i);
  declared.run.evidenceStatus = 'incomplete';
  declared.attempt.evidenceStatus = 'incomplete';
  await declared.save();
  assert.equal(declared.verify().status, 0);
});

test('verify preserves automatic host metadata without requiring it for completeness', async () => {
  const fixture = await setup();
  fixture.attempt.sessions[0].hostVersion = unknown('Not copied into the manifest.');
  await fixture.save();
  assert.equal(fixture.verify().status, 0);
  fixture.attempt.sessions[0].hostVersion = 'invented';
  await fixture.save();
  assert.match(fixture.verify().stderr, /session asset identity differs/i);
});

test('verify associates an input preceding its native context and ignores unknown-integrity wording', async () => {
  const fixture = await setup();
  const asset = fixture.attempt.assets[0];
  const path = join(fixture.assetRoot, asset.tag, asset.name);
  const events = gunzipSync(await readFile(path)).toString('utf8').trim().split('\n').map(JSON.parse);
  [events[1], events[2]] = [events[2], events[1]];
  events[1].ordinal = 1;
  events[2].ordinal = 2;
  const bytes = gzipSync(events.map((event) => JSON.stringify(event)).join('\n') + '\n');
  await writeFile(path, bytes);
  asset.sizeBytes = bytes.length;
  asset.sha256 = sha256(bytes);
  fixture.attempt.sessions[0].turns[0].eventOrdinal = 2;
  fixture.attempt.installations[0].eventOrdinal = 2;
  fixture.attempt.requests[0].eventOrdinal = 1;
  const installed = structuredClone(fixture.attempt.installations[0]);
  installed.adapters = [{ name: 'alpha', version: 'test', integrity: unknown('Not measured.') }];
  fixture.attempt.installations[0].adapters = structuredClone(installed.adapters);
  installed.cli.integrity.reason = 'Unavailable in this observation.';
  installed.core.integrity.reason = 'Still unavailable.';
  installed.adapters[0].integrity.reason = 'No artifact digest observed.';
  await appendTurn(fixture, installed);
  assert.equal(fixture.verify().status, 0);
  fixture.attempt.installations[1].adapters[0].integrity = 'now-known';
  await fixture.save();
  assert.match(fixture.verify().stderr, /differs from the project baseline/i);
});

test('verify preserves repeated native contexts without inventing developer requests', async () => {
  const fixture = await setup();
  await appendTurn(fixture, fixture.attempt.installations[0]);
  fixture.attempt.requests.pop();
  const asset = fixture.attempt.assets[0];
  const path = join(fixture.assetRoot, asset.tag, asset.name);
  const events = gunzipSync(await readFile(path)).toString('utf8').trim().split('\n').map(JSON.parse);
  events.pop();
  events.at(-1).payload.rootTurnId = 'turn-1';
  const bytes = gzipSync(events.map((event) => JSON.stringify(event)).join('\n') + '\n');
  await writeFile(path, bytes);
  asset.sizeBytes = bytes.length;
  asset.sha256 = sha256(bytes);
  asset.lastEventOrdinal = events.at(-1).ordinal;
  await fixture.save();
  assert.equal(fixture.verify().status, 0);
  fixture.attempt.installations.reverse();
  await fixture.save();
  assert.match(fixture.verify().stderr, /observations are out of native session order/i);
});

test('verify records absent tooling, then binds installation to the exact target and project baseline', async () => {
  const fixture = await setup();
  const installed = structuredClone(fixture.attempt.installations[0]);
  fixture.attempt.installations[0].cli = { state: 'absent', reason: 'No root-local CLI installed.' };
  fixture.attempt.installations[0].core = { state: 'absent', reason: 'No resolved Core installed.' };
  await fixture.save();
  assert.equal(fixture.verify().status, 0);

  await appendTurn(fixture, fixture.attempt.installations[0]);
  assert.equal(fixture.verify().status, 0);
  installed.core.version = 'resolved-core';
  await appendTurn(fixture, installed);
  assert.equal(fixture.verify().status, 0);
  fixture.attempt.installations[2].cli.version = 'wrong-target';
  await fixture.save();
  assert.match(fixture.verify().stderr, /differs from the CLI target/i);
  fixture.attempt.installations[2].cli.version = installed.cli.version;
  await appendTurn(fixture, installed);
  assert.equal(fixture.verify().status, 0);

  for (const component of ['cli', 'core']) {
    fixture.attempt.installations[3][component].version = 'unexplained';
    await fixture.save();
    assert.match(fixture.verify().stderr, /differs from the project baseline/i);
    fixture.attempt.installations[3][component] = structuredClone(installed[component]);
    fixture.attempt.installations[3][component].integrity = 'changed-integrity';
    await fixture.save();
    assert.match(fixture.verify().stderr, /differs from the project baseline/i);
    fixture.attempt.installations[3][component] = structuredClone(installed[component]);
  }
  fixture.attempt.installations[3].cli = { state: 'absent', reason: 'Installation disappeared.' };
  await fixture.save();
  assert.match(fixture.verify().stderr, /established tooling became absent/i);
  fixture.attempt.installations[3].cli = structuredClone(installed.cli);
  fixture.attempt.installations[3].skill.contentHash = 'b'.repeat(64);
  await fixture.save();
  assert.match(fixture.verify().stderr, /selected skill identity changed/i);
});

test('verify preserves installed-at-start composition and rejects invented absence and adapter drift', async () => {
  const fixture = await setup();
  fixture.attempt.installations[0].cli.version = 'healthy-cli';
  fixture.attempt.installations[0].core.version = 'actual-core';
  fixture.attempt.installations[0].adapters = [
    { name: 'alpha', version: 'test', integrity: 'test' },
    { name: 'beta', version: 'test', integrity: 'test' },
  ];
  const installed = structuredClone(fixture.attempt.installations[0]);
  installed.adapters.reverse();
  await appendTurn(fixture, installed);
  assert.equal(fixture.verify().status, 0);
  fixture.attempt.installations[1].adapters.push({ name: 'new-adapter', version: 'test', integrity: 'test' });
  await fixture.save();
  assert.match(fixture.verify().stderr, /differs from the project baseline/i);
  fixture.attempt.installations[1].adapters = structuredClone(installed.adapters);
  fixture.attempt.installations[1].adapters.push({ ...installed.adapters[0] });
  await fixture.save();
  assert.match(fixture.verify().stderr, /duplicate or case collision/i);
  fixture.attempt.installations[1].adapters = structuredClone(installed.adapters);
  fixture.attempt.installations[0].cli = { state: 'unknown', reason: 'Not inspected.' };
  await fixture.save();
  assert.match(fixture.verify().stderr, /Attempt manifest/i);
  fixture.attempt.installations[0].cli = { state: 'absent', reason: '' };
  await fixture.save();
  assert.match(fixture.verify().stderr, /Attempt manifest/i);
});

test('verify treats either absent component as initial missing tooling', async () => {
  for (const component of ['cli', 'core']) {
    const fixture = await setup();
    const installed = structuredClone(fixture.attempt.installations[0]);
    fixture.attempt.installations[0][component] = { state: 'absent', reason: 'Not installed.' };
    await appendTurn(fixture, installed);
    assert.equal(fixture.verify().status, 0);
    fixture.attempt.installations[1].cli.version = 'another-cli';
    await fixture.save();
    assert.match(fixture.verify().stderr, /differs from the CLI target/i);
  }
});

test('verify accepts independent Core baselines for two projects in one run', async () => {
  const fixture = await setup();
  const second = structuredClone(fixture.attempt);
  const secondSession = randomUUID();
  second.attemptId = 'two';
  second.branch = 'fixture_two_01';
  git(fixture.root, 'branch', second.branch, fixture.finalCommit);
  second.sessions[0].id = secondSession;
  second.requests[0].sessionId = secondSession;
  second.installations[0].sessionId = secondSession;
  second.installations[0].core.version = 'another-core';
  const asset = second.assets[0];
  const original = gunzipSync(await readFile(join(fixture.assetRoot, asset.tag, asset.name))).toString('utf8');
  const bytes = gzipSync(original.replaceAll(sessionId, secondSession));
  asset.name = 'session-two.jsonl.gz';
  asset.sessionId = secondSession;
  asset.sizeBytes = bytes.length;
  asset.sha256 = sha256(bytes);
  await writeFile(join(fixture.assetRoot, asset.tag, asset.name), bytes);
  second.checks[0].coveredArtifacts = second.checks[0].coveredArtifacts.map((path) =>
    path.replace('/attempts/one.json', '/attempts/two.json').replace('/session.jsonl.gz', '/session-two.jsonl.gz'));
  const path = 'evidence/runs/synthetic/attempts/two.json';
  fixture.run.attempts.push(path);
  await writeJson(join(fixture.root, path), second);
  await fixture.save();
  assert.equal(fixture.verify().status, 0);
});

test('verify binds a complete request to source history and exact session asset bytes', async () => {
  const fixture = await setup();
  assert.equal(fixture.verify().status, 0);

  fixture.attempt.requests[0].text = 'A different request.';
  await fixture.save();
  assert.match(fixture.verify().stderr, /request differs/i);
  fixture.attempt.requests[0].text = 'Build the example.';

  fixture.attempt.requests[0].redactionIds = ['missing'];
  await fixture.save();
  assert.match(fixture.verify().stderr, /missing redaction/i);
  fixture.attempt.requests[0].redactionIds = [];

  fixture.attempt.requests[0].afterCommit = fixture.baseCommit;
  await fixture.save();
  assert.match(fixture.verify().stderr, /final commit lacks/i);
  fixture.attempt.requests[0].afterCommit = fixture.finalCommit;

  fixture.attempt.sessions[0].turns[0].effectiveEffort = 'medium';
  fixture.attempt.sessions[0].turns[0].deviation = true;
  await fixture.save();
  assert.match(fixture.verify().stderr, /effective turn settings differ/i);
  fixture.attempt.sessions[0].turns[0].effectiveEffort = 'xhigh';
  fixture.attempt.sessions[0].turns[0].deviation = false;

  fixture.run.expectedActor.effort = 'medium';
  await fixture.save();
  assert.match(fixture.verify().stderr, /inconsistent effective settings/i);
  fixture.attempt.sessions[0].turns[0].deviation = true;
  await fixture.save();
  assert.equal(fixture.verify().status, 0);
  fixture.run.expectedActor.effort = 'xhigh';
  fixture.attempt.sessions[0].turns[0].deviation = false;

  fixture.attempt.sessions[0].turns[0].requestedEffort = 'medium';
  await fixture.save();
  assert.match(fixture.verify().stderr, /inconsistent effective settings/i);
  fixture.attempt.sessions[0].turns[0].deviation = true;
  await fixture.save();
  assert.equal(fixture.verify().status, 0);
  fixture.attempt.sessions[0].turns[0].requestedEffort = 'xhigh';
  fixture.attempt.sessions[0].turns[0].deviation = false;

  fixture.run.expectedActor = unknown('Actor settings were not recorded.');
  await fixture.save();
  assert.match(fixture.verify().stderr, /required durable evidence/i);
  fixture.run.expectedActor = { model: 'gpt-6.1-sol', effort: 'xhigh' };

  fixture.attempt.installations[0].source.name = 'absent.txt';
  await fixture.save();
  assert.match(fixture.verify().stderr, /verified log asset/i);
  fixture.attempt.installations[0].source.name = 'identities.txt';

  fixture.attempt.skillRelease = 'different-release';
  await fixture.save();
  assert.match(fixture.verify().stderr, /matching release prerequisites/i);
  fixture.attempt.skillRelease = 'test-release';

  fixture.attempt.installations[0].core.version = 'different-core';
  await fixture.save();
  assert.equal(fixture.verify().status, 0);
  fixture.attempt.installations[0].core.version = 'test-core';

  fixture.attempt.installations.push({ ...fixture.attempt.installations[0] });
  await fixture.save();
  assert.match(fixture.verify().stderr, /duplicate or case collision/i);
  fixture.attempt.installations.pop();

  fixture.attempt.assets[0].sessionId = '0199c0b1-63da-73a1-b532-4e161922ea30';
  await fixture.save();
  assert.match(fixture.verify().stderr, /lacks a session export/i);
  fixture.attempt.assets[0].sessionId = sessionId;

  fixture.attempt.installations = [];
  await fixture.save();
  assert.match(fixture.verify().stderr, /required durable evidence/i);
  fixture.attempt.installations = [{ sessionId, eventOrdinal: 1,
    source: fixture.identitySource('turn-1'),
    skill: { ref: 'test-release', contentHash: 'a'.repeat(64) },
    cli: { version: 'test-cli', integrity: unknown('Synthetic local test.') },
    core: { version: 'test-core', integrity: unknown('Synthetic local test.') }, adapters: [],
  }];

  fixture.attempt.failures = unknown('Failure records were not inspected.');
  await fixture.save();
  assert.match(fixture.verify().stderr, /required durable evidence/i);
  fixture.attempt.failures = [];

  fixture.attempt.interventions = unknown('Interventions were not inspected.');
  await fixture.save();
  assert.match(fixture.verify().stderr, /required durable evidence/i);
  fixture.attempt.interventions = [];

  fixture.attempt.actorOutcome = 'failed';
  await fixture.save();
  assert.match(fixture.verify().stderr, /lacks a failure record/i);
  fixture.attempt.failures = [{ kind: 'actor', requestId: 'request-one',
    description: 'The synthetic actor failed.', asset: null }];
  await fixture.save();
  assert.equal(fixture.verify().status, 0);
  fixture.attempt.actorOutcome = 'concluded';
  fixture.attempt.failures = [];

  const privacyCoverage = fixture.attempt.checks[0].coveredArtifacts;
  privacyCoverage.shift();
  await fixture.save();
  assert.match(fixture.verify().stderr, /recorded privacy review/i);
  privacyCoverage.unshift('evidence/index.json');

  const historyCoverage = `git/${fixture.baseCommit}/${fixture.finalCommit}`;
  const historyIndex = privacyCoverage.indexOf(historyCoverage);
  privacyCoverage.splice(historyIndex, 1);
  await fixture.save();
  assert.match(fixture.verify().stderr, /recorded privacy review/i);
  privacyCoverage.splice(historyIndex, 0, historyCoverage);

  fixture.attempt.checks[0].inputCommit = fixture.baseCommit;
  await fixture.save();
  assert.match(fixture.verify().stderr, /recorded privacy review/i);
  fixture.attempt.checks[0].inputCommit = fixture.finalCommit;

  fixture.attempt.checks[0].coveredArtifacts.pop();
  await fixture.save();
  assert.match(fixture.verify().stderr, /recorded privacy review/i);
  fixture.attempt.checks[0].coveredArtifacts.push('synthetic/identities.txt');

  fixture.attempt.interventions = [{ requestId: 'request-one',
    interventionRequestId: 'missing-intervention', originalResult: 'Original result.',
    assistedResult: 'Assisted result.', originalCommit: fixture.finalCommit,
    assistedCommit: fixture.finalCommit }];
  await fixture.save();
  assert.match(fixture.verify().stderr, /does not link its original and assisted requests/i);
  fixture.attempt.interventions = [];

  fixture.run.prerequisites = unknown('Release evidence was not recorded.');
  await fixture.save();
  assert.match(fixture.verify().stderr, /verified release prerequisites/i);
  fixture.run.prerequisites = [
    { component: 'core', version: 'test-core', integrity: 'sha256:test',
      source: fixture.identitySource('core-release') },
    { component: 'cli', version: 'test-cli', integrity: 'sha256:test',
      source: fixture.identitySource('cli-release') },
    { component: 'skill', version: 'test-release', integrity: 'sha256:test',
      source: fixture.identitySource('skill-release') },
  ];

  fixture.run.prerequisites[0].source.name = 'absent.txt';
  await fixture.save();
  assert.match(fixture.verify().stderr, /verified log asset/i);
  fixture.run.evidenceStatus = 'incomplete';
  await fixture.save();
  assert.match(fixture.verify().stderr, /verified log asset/i);
  fixture.run.evidenceStatus = 'complete';
  fixture.run.prerequisites[0].source.name = 'identities.txt';

  fixture.run.prerequisites[0].version = 'different-core';
  await fixture.save();
  assert.equal(fixture.verify().status, 0);
  fixture.run.prerequisites[0].version = 'test-core';

  const reviewsDirectory = join(fixture.root, 'evidence', 'runs', 'synthetic', 'reviews');
  await mkdir(reviewsDirectory);
  const attemptReview = 'evidence/runs/synthetic/reviews/attempt.md';
  await writeFile(join(reviewsDirectory, 'attempt.md'), '# Attempt review\n');
  fixture.attempt.reviewStatus = 'complete';
  fixture.attempt.review = attemptReview;
  await fixture.save();
  assert.match(fixture.verify().stderr, /recorded privacy review/i);
  privacyCoverage.push(attemptReview);
  await fixture.save();
  assert.equal(fixture.verify().status, 0);

  const runReview = 'evidence/runs/synthetic/reviews/run.md';
  await writeFile(join(reviewsDirectory, 'run.md'), '# Run review\n');
  fixture.run.reviewStatus = 'complete';
  fixture.run.review = runReview;
  await fixture.save();
  assert.match(fixture.verify().stderr, /run review lacks recorded privacy coverage/i);
  privacyCoverage.push(runReview);
  await fixture.save();
  assert.equal(fixture.verify().status, 0);

  fixture.run.review = 'evidence/index.json';
  await fixture.save();
  assert.match(fixture.verify().stderr, /outside its run review directory/i);
  fixture.run.review = runReview;

  await fixture.save();
  const identityPath = join(fixture.assetRoot, 'synthetic', 'identities.txt');
  await writeFile(identityPath, 'corrupt');
  assert.match(fixture.verify().stderr, /wrong size or SHA-256/i);
  await writeFile(identityPath, fixture.identityLog);

  await fixture.save();
  const assetPath = join(fixture.assetRoot, 'synthetic', 'session.jsonl.gz');
  await writeFile(assetPath, 'corrupt');
  assert.match(fixture.verify().stderr, /wrong size or SHA-256|could not be read/i);
  await rm(assetPath);
  assert.match(fixture.verify().stderr, /asset is unavailable/i);
});

test('verify resolves check and failure evidence by Release tag and name', async () => {
  const fixture = await setup();
  const identityAsset = { tag: 'synthetic', name: 'identities.txt' };
  fixture.attempt.checks.push({ kind: 'command', description: 'synthetic identity check',
    inputCommit: fixture.finalCommit, result: 'passed', coveredArtifacts: [],
    asset: identityAsset });
  fixture.attempt.failures = [{ kind: 'environment', requestId: 'request-one',
    description: 'A synthetic provider was unavailable.', asset: identityAsset }];
  await fixture.save();
  assert.equal(fixture.verify().status, 0);

  fixture.attempt.checks[1].asset = { tag: 'different', name: 'identities.txt' };
  await fixture.save();
  assert.match(fixture.verify().stderr, /lacks its declared asset/i);
  fixture.attempt.checks[1].asset = identityAsset;

  fixture.attempt.failures[0].asset = { tag: 'synthetic', name: 'missing.txt' };
  await fixture.save();
  assert.match(fixture.verify().stderr, /lacks its declared asset/i);
});

test('verify binds redaction records to the exported event and field', async () => {
  const fixture = await setup();
  const assetPath = join(fixture.assetRoot, 'synthetic', 'session.jsonl.gz');
  const events = gunzipSync(await readFile(assetPath)).toString('utf8').trim().split('\n')
    .map((line) => JSON.parse(line));
  events[2].payload.content[0].text = 'Build [redacted].';
  events[2].redactionIds = ['request-detail'];
  const compressed = gzipSync(`${events.map((event) => JSON.stringify(event)).join('\n')}\n`);
  await writeFile(assetPath, compressed);
  fixture.attempt.assets[0].sizeBytes = compressed.length;
  fixture.attempt.assets[0].sha256 = sha256(compressed);
  fixture.attempt.requests[0].text = 'Build [redacted].';
  fixture.attempt.requests[0].redactionIds = ['request-detail'];
  const redaction = { id: 'request-detail', reason: 'Synthetic private detail.',
    sessionId, eventOrdinal: 2, path: ['payload', 'content', 0, 'text'],
    affectedLocations: ['synthetic/session.jsonl.gz',
      'evidence/runs/synthetic/attempts/one.json'] };
  fixture.attempt.redactions = [redaction];
  await fixture.save();
  assert.equal(fixture.verify().status, 0);

  redaction.eventOrdinal = 1;
  await fixture.save();
  assert.match(fixture.verify().stderr, /redaction locator differs/i);
  redaction.eventOrdinal = 2;

  redaction.sessionId = '0199c0b1-63da-73a1-b532-4e161922ea30';
  await fixture.save();
  assert.match(fixture.verify().stderr, /redaction locator differs/i);
  redaction.sessionId = sessionId;

  redaction.path = ['payload', 'role'];
  await fixture.save();
  assert.match(fixture.verify().stderr, /redaction locator differs/i);
  redaction.path = ['payload', 'content', 0, 'text'];

  fixture.attempt.redactions.push({ ...redaction, id: 'unused-detail' });
  await fixture.save();
  assert.match(fixture.verify().stderr, /declared redaction lacks its session event/i);
});

test('verify rejects a complete intervention without its original and assisted lineage', async () => {
  const fixture = await setup();
  const secondEventOrdinal = await appendUserMessage(fixture);
  fixture.attempt.requests[0].afterCommit = fixture.baseCommit;
  fixture.attempt.requests.push({
    ...fixture.attempt.requests[0], id: 'request-two', ordinal: 2,
    kind: 'intervention', eventOrdinal: secondEventOrdinal,
    beforeCommit: fixture.baseCommit, afterCommit: fixture.finalCommit,
  });
  await fixture.save();
  assert.match(fixture.verify().stderr, /lacks its original and assisted results/i);

  fixture.attempt.interventions = [{ requestId: 'request-one',
    interventionRequestId: 'request-two', originalResult: 'The original work stopped.',
    assistedResult: 'The intervention completed the example.',
    originalCommit: fixture.baseCommit, assistedCommit: fixture.finalCommit }];
  await fixture.save();
  assert.equal(fixture.verify().status, 0);

  fixture.attempt.interventions.push({ ...fixture.attempt.interventions[0] });
  await fixture.save();
  assert.match(fixture.verify().stderr, /duplicate or case collision/i);
});

test('verify requires manifest request order to follow native session events', async () => {
  const fixture = await setup();
  const secondEventOrdinal = await appendUserMessage(fixture);
  fixture.attempt.requests[0].afterCommit = fixture.baseCommit;
  fixture.attempt.requests.push({
    ...fixture.attempt.requests[0], id: 'request-two', ordinal: 2,
    kind: 'follow-up', eventOrdinal: secondEventOrdinal,
    beforeCommit: fixture.baseCommit, afterCommit: fixture.finalCommit,
  });
  await fixture.save();
  assert.equal(fixture.verify().status, 0);

  fixture.attempt.requests[0].eventOrdinal = secondEventOrdinal;
  fixture.attempt.requests[1].eventOrdinal = 2;
  await fixture.save();
  assert.match(fixture.verify().stderr, /out of native session order/i);
});

test('verify keeps interrupted attempts incomplete and checks durable recovery claims', async () => {
  const fixture = await setup();
  const checkpointRoot = join(fixture.root, 'checkpoint');
  git(fixture.root, 'worktree', 'add', '--detach', checkpointRoot, fixture.finalCommit);
  await writeFile(join(checkpointRoot, 'changed.txt'), 'unfinished change\n');
  await writeFile(join(checkpointRoot, 'added.txt'), 'new evidence\n');
  await writeFile(join(checkpointRoot, 'README.md'), '# Updated project\n');
  await writeFile(join(checkpointRoot, '.agents', 'skills', 'moldea', 'SKILL.md'),
    '# Updated skill\n');
  await rm(join(checkpointRoot, 'deleted.txt'));
  const checkpointPaths = ['changed.txt', 'added.txt', 'README.md',
    '.agents/skills/moldea/SKILL.md', 'deleted.txt'];
  git(checkpointRoot, 'add', '--', ...checkpointPaths);
  git(checkpointRoot, 'commit', '-m', 'test unfinished checkpoint', '--', ...checkpointPaths);
  const checkpointCommit = git(checkpointRoot, 'rev-parse', 'HEAD');
  git(fixture.root, 'worktree', 'remove', checkpointRoot);
  git(fixture.root, 'branch', '-f', 'fixture_one_01', checkpointCommit);

  const recoverRoot = join(fixture.root, 'restored');
  git(fixture.root, 'worktree', 'add', '--detach', recoverRoot, checkpointCommit);
  const changed = await readFile(join(recoverRoot, 'changed.txt'));
  const added = await readFile(join(recoverRoot, 'added.txt'));
  const readme = await readFile(join(recoverRoot, 'README.md'));
  const skill = await readFile(join(recoverRoot, '.agents', 'skills', 'moldea', 'SKILL.md'));
  await assert.rejects(readFile(join(recoverRoot, 'deleted.txt')));
  const inventory = [
    { path: 'changed.txt', kind: 'file', mode: '100644', sha256: sha256(changed) },
    { path: 'added.txt', kind: 'file', mode: '100644', sha256: sha256(added) },
    { path: 'README.md', kind: 'file', mode: '100644', sha256: sha256(readme) },
    { path: '.agents/skills/moldea/SKILL.md', kind: 'file', mode: '100644', sha256: sha256(skill) },
    { path: 'deleted.txt', kind: 'deletion', mode: null, sha256: null },
  ];
  assert.equal(inventory[0].sha256, sha256('unfinished change\n'));
  assert.equal(inventory[1].sha256, sha256('new evidence\n'));
  assert.equal(inventory[2].sha256, sha256('# Updated project\n'));
  assert.equal(inventory[3].sha256, sha256('# Updated skill\n'));
  git(fixture.root, 'worktree', 'remove', recoverRoot);

  fixture.attempt.actorOutcome = 'interrupted';
  fixture.attempt.evidenceStatus = 'incomplete';
  fixture.attempt.finalCommit = null;
  fixture.attempt.lastDurableCommit = checkpointCommit;
  fixture.attempt.requests[0].afterCommit = checkpointCommit;
  fixture.attempt.checks.push({ kind: 'manual', description: 'recovery restoration',
    inputCommit: checkpointCommit, result: 'passed',
    coveredArtifacts: [`git/${fixture.finalCommit}/${checkpointCommit}`],
    asset: null });
  fixture.attempt.recovery = { kind: 'checkpoint', baseCommit: fixture.finalCommit,
    checkpointCommit, asset: null, inventory,
    restoreProcedure: 'Check out the checkpoint commit in a disposable worktree.',
    verified: true, gaps: [] };
  fixture.run.evidenceStatus = 'incomplete';
  await fixture.save();
  assert.equal(fixture.verify().status, 0);

  const restorationCheck = fixture.attempt.checks.at(-1);
  restorationCheck.inputCommit = fixture.finalCommit;
  await fixture.save();
  assert.match(fixture.verify().stderr, /matching restoration check/i);
  restorationCheck.inputCommit = checkpointCommit;
  restorationCheck.coveredArtifacts = [`git/${fixture.baseCommit}/${checkpointCommit}`];
  await fixture.save();
  assert.match(fixture.verify().stderr, /matching restoration check/i);
  restorationCheck.coveredArtifacts = [`git/${fixture.finalCommit}/${checkpointCommit}`];
  restorationCheck.asset = { tag: 'synthetic', name: 'identities.txt' };
  await fixture.save();
  assert.match(fixture.verify().stderr, /matching restoration check/i);
  restorationCheck.asset = null;

  fixture.attempt.recovery.gaps = ['A required untracked file is absent.'];
  await fixture.save();
  assert.match(fixture.verify().stderr, /missing material/i);
  fixture.attempt.recovery.gaps = [];
  fixture.attempt.recovery.inventory[0].sha256 = '0'.repeat(64);
  await fixture.save();
  assert.match(fixture.verify().stderr, /recovery file differs/i);
  fixture.attempt.recovery.inventory[0].sha256 = sha256('unfinished change\n');
  fixture.attempt.recovery.inventory = inventory.slice(0, 2);
  await fixture.save();
  assert.match(fixture.verify().stderr, /recovery inventory differs/i);
  fixture.attempt.recovery.inventory = inventory;
  fixture.attempt.checks.pop();
  await fixture.save();
  assert.match(fixture.verify().stderr, /restoration check/i);
  fixture.attempt.recovery.verified = false;
  await fixture.save();
  assert.equal(fixture.verify().status, 0);

  fixture.attempt.recovery.inventory[0].path = '../outside.txt';
  await fixture.save();
  assert.match(fixture.verify().stderr, /source path has traversal/i);
  fixture.attempt.recovery.inventory[0].path = '_archive/hidden.txt';
  await fixture.save();
  assert.match(fixture.verify().stderr, /source path is in an excluded directory/i);
});

test('verify binds interrupted recovery to an exact asset and restoration check', async () => {
  const fixture = await setup();
  const recoveryBytes = Buffer.from('synthetic recovery delta\n');
  const recoveryPath = join(fixture.assetRoot, 'synthetic', 'recovery.bin');
  await writeFile(recoveryPath, recoveryBytes);
  const recoveryAsset = { tag: 'synthetic', name: 'recovery.bin' };
  fixture.attempt.assets.push({ kind: 'recovery', ...recoveryAsset,
    sizeBytes: recoveryBytes.length, sha256: sha256(recoveryBytes),
    mediaType: 'application/octet-stream', sessionId: null,
    firstEventOrdinal: null, lastEventOrdinal: null });
  fixture.attempt.actorOutcome = 'interrupted';
  fixture.attempt.evidenceStatus = 'incomplete';
  fixture.attempt.finalCommit = null;
  fixture.attempt.recovery = { kind: 'asset', baseCommit: fixture.finalCommit,
    checkpointCommit: null, asset: recoveryAsset,
    inventory: [{ path: 'README.md', kind: 'file', mode: '100644',
      sha256: sha256('# Updated project\n') }],
    restoreProcedure: 'Apply the delta in a disposable checkout and inspect README.md.',
    verified: true, gaps: [] };
  fixture.attempt.checks.push({ kind: 'manual', description: 'recovery restoration',
    inputCommit: fixture.finalCommit, result: 'passed',
    coveredArtifacts: ['synthetic/recovery.bin'], asset: recoveryAsset });
  fixture.run.evidenceStatus = 'incomplete';
  await fixture.save();
  assert.equal(fixture.verify().status, 0);

  const restorationCheck = fixture.attempt.checks.at(-1);
  restorationCheck.inputCommit = fixture.baseCommit;
  await fixture.save();
  assert.match(fixture.verify().stderr, /matching restoration check/i);
  restorationCheck.inputCommit = fixture.finalCommit;
  restorationCheck.coveredArtifacts = ['synthetic/identities.txt'];
  await fixture.save();
  assert.match(fixture.verify().stderr, /matching restoration check/i);
  restorationCheck.coveredArtifacts = ['synthetic/recovery.bin'];
  restorationCheck.asset = { tag: 'synthetic', name: 'identities.txt' };
  await fixture.save();
  assert.match(fixture.verify().stderr, /matching restoration check/i);
  restorationCheck.asset = recoveryAsset;

  fixture.attempt.recovery.asset = { tag: 'different', name: 'recovery.bin' };
  await fixture.save();
  assert.match(fixture.verify().stderr, /lacks its declared asset/i);
  fixture.attempt.recovery.asset = recoveryAsset;

  fixture.attempt.checks.pop();
  await fixture.save();
  assert.match(fixture.verify().stderr, /lacks a matching restoration check/i);
  fixture.attempt.recovery.verified = false;
  await fixture.save();
  assert.equal(fixture.verify().status, 0);

  await writeFile(recoveryPath, 'corrupt');
  assert.match(fixture.verify().stderr, /wrong size or SHA-256/i);
});

test('verify rejects traversal, reserved paths and case-colliding run entries', async () => {
  const fixture = await setup();
  fixture.run.attempts.push('evidence/runs/synthetic/attempts/../one.json');
  await fixture.save();
  assert.match(fixture.verify().stderr, /path component is not portable/i);
  fixture.run.attempts.pop();

  fixture.attempt.assets[0].name = 'con.jsonl.gz';
  fixture.attempt.checks[0].coveredArtifacts[5] = 'synthetic/con.jsonl.gz';
  await fixture.save();
  assert.match(fixture.verify().stderr, /excluded or reserved/i);
  fixture.attempt.assets[0].name = 'session.jsonl.gz';
  fixture.attempt.checks[0].coveredArtifacts[5] = 'synthetic/session.jsonl.gz';

  fixture.run.attempts.push('evidence/runs/synthetic/attempts/ONE.json');
  await fixture.save();
  assert.match(fixture.verify().stderr, /duplicate or case collision/i);
});
