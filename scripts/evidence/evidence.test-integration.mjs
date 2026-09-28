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

const setup = async () => {
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
  git(root, 'add', '.');
  git(root, 'commit', '-m', 'test base');
  const baseCommit = git(root, 'rev-parse', 'HEAD');
  git(root, 'branch', 'fixture_one_01');
  await mkdir(join(root, 'evidence', 'scenarios'), { recursive: true });
  await writeFile(join(root, 'evidence', 'scenarios', 'example.md'), '# Example\n');
  git(root, 'add', '.');
  git(root, 'commit', '-m', 'test scenario');
  const scenarioCommit = git(root, 'rev-parse', 'HEAD');
  git(root, 'switch', 'fixture_one_01');
  await writeFile(join(root, 'changed.txt'), 'actor result\n');
  git(root, 'add', '.');
  git(root, 'commit', '-m', 'test actor result');
  const finalCommit = git(root, 'rev-parse', 'HEAD');
  git(root, 'switch', 'main');

  const runDirectory = join(root, 'evidence', 'runs', 'synthetic');
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
      model: 'gpt-6-sol', effort: 'xhigh', root_turn_id: 'turn-1',
    } },
    { type: 'response_item', timestamp: '2026-09-27T00:00:02Z', payload: {
      type: 'message', role: 'developer', content: [{ type: 'input_text', text: 'Build the example.' }],
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
  const runRelativePath = 'evidence/runs/synthetic/run.json';
  const attemptRelativePath = 'evidence/runs/synthetic/attempts/one.json';
  const attempt = {
    formatVersion: 1, runId: 'synthetic', scenarioId: 'example', attemptId: 'one',
    branch: 'fixture_one_01', baseCommit, finalCommit, lastDurableCommit: finalCommit,
    scenarioDefinition: { path: 'evidence/scenarios/example.md', commit: scenarioCommit },
    observedSummary: 'Synthetic example completed.', actorOutcome: 'concluded',
    outcomeReason: null, evidenceStatus: 'complete', reviewStatus: 'pending', review: null,
    sessions: [{ id: sessionId, hostVersion: 'test-host', turns: [{
      eventOrdinal: 1, requestedModel: 'gpt-6-sol', requestedEffort: 'xhigh',
      effectiveModel: 'gpt-6-sol', effectiveEffort: 'xhigh', deviation: false,
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
    formatVersion: 1, runId: 'synthetic', date: '2026-09-27',
    summary: 'Synthetic evidence verification.',
    expectedActor: { model: 'gpt-6-sol', effort: 'xhigh' }, prerequisites: [
      { component: 'core', version: 'test-core', integrity: 'sha256:test',
        source: identitySource('core-release') },
      { component: 'cli', version: 'test-cli', integrity: 'sha256:test',
        source: identitySource('cli-release') },
      { component: 'skill', version: 'test-release', integrity: 'sha256:test',
        source: identitySource('skill-release') },
    ],
    attempts: [attemptRelativePath], evidenceStatus: 'complete', reviewStatus: 'pending',
    review: null, limitations: [],
  };
  const index = { formatVersion: 1, runs: [{ runId: 'synthetic',
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

const appendDeveloperMessage = async (fixture) => {
  const assetPath = join(fixture.assetRoot, 'synthetic', 'session.jsonl.gz');
  const original = gunzipSync(await readFile(assetPath)).toString('utf8');
  const nextOrdinal = fixture.attempt.assets[0].lastEventOrdinal + 1;
  const event = { ordinal: nextOrdinal, timestamp: '2026-09-27T00:00:03Z',
    redactionIds: [], kind: 'message', payload: { role: 'developer',
      content: [{ type: 'input_text', text: 'Build the example.' }] } };
  const compressed = gzipSync(`${original}${JSON.stringify(event)}\n`);
  await writeFile(assetPath, compressed);
  fixture.attempt.assets[0].sizeBytes = compressed.length;
  fixture.attempt.assets[0].sha256 = sha256(compressed);
  fixture.attempt.assets[0].lastEventOrdinal = nextOrdinal;
  return nextOrdinal;
};

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
  assert.match(fixture.verify().stderr, /wrong required actor settings/i);
  fixture.attempt.sessions[0].turns[0].deviation = true;
  await fixture.save();
  assert.match(fixture.verify().stderr, /wrong required actor settings/i);
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
  fixture.run.expectedActor = { model: 'gpt-6-sol', effort: 'xhigh' };

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
  assert.match(fixture.verify().stderr, /installed composition differs/i);
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
  assert.match(fixture.verify().stderr, /installed composition differs/i);
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
  const secondEventOrdinal = await appendDeveloperMessage(fixture);
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
  const secondEventOrdinal = await appendDeveloperMessage(fixture);
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
  git(checkpointRoot, 'add', '-A');
  git(checkpointRoot, 'commit', '-m', 'test unfinished checkpoint');
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
