import { createHash } from 'node:crypto';
import { createReadStream, createWriteStream } from 'node:fs';
import { lstat, readFile, realpath, rename, rm, writeFile } from 'node:fs/promises';
import { createGunzip, createGzip } from 'node:zlib';
import { execFile, spawn } from 'node:child_process';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { createInterface } from 'node:readline';
import { pipeline } from 'node:stream/promises';
import { Transform, Writable } from 'node:stream';
import { promisify } from 'node:util';

import {
  AttemptSchema,
  CaptureRulesSchema,
  IndexSchema,
  NativeRecordSchema,
  RunSchema,
} from './types.mjs';

const execFileAsync = promisify(execFile);
let repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const excludedNames = new Set(['_archive', '_archives', '_backup', '_backups']);
const portableComponent = /^[a-z0-9][a-z0-9._-]*$/;
const requiredActor = { model: 'gpt-6-sol', effort: 'xhigh' };

class EvidenceError extends Error {}

const fail = (message) => {
  throw new EvidenceError(message);
};

const unknown = (entry) => entry !== null && typeof entry === 'object' && entry.state === 'unknown';

const rejectExcludedLocation = (path) => {
  if (path.split(/[\\/]/).some((part) => excludedNames.has(part))) {
    fail('A selected location is in an excluded directory.');
  }
};

const validatePath = (path, isSingleComponent = false) => {
  if (typeof path !== 'string' || path.length === 0 || path.length > 160) {
    fail('A portable path is empty or too long.');
  }
  if (isAbsolute(path) || /^[a-z]:/i.test(path) || path.includes('\\')) {
    fail('An absolute or platform-specific path is not allowed.');
  }
  const parts = path.split('/');
  if (isSingleComponent && parts.length !== 1) fail('An asset name must be one component.');
  for (const part of parts) {
    if (!portableComponent.test(part) || part.length > 64 || part.endsWith('.')) {
      fail('A path component is not portable.');
    }
    if (excludedNames.has(part) || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part)) {
      fail('A path component is excluded or reserved.');
    }
  }
  return parts;
};

// recovery inventory paths come from project history, not generated evidence names
const validateSourcePath = (path) => {
  if (typeof path !== 'string' || path.length === 0 || isAbsolute(path) ||
      /^[a-z]:/i.test(path) || path.includes('\\')) {
    fail('A source path is absolute or platform-specific.');
  }
  const parts = path.split('/');
  if (parts.some((part) => part === '' || part === '.' || part === '..' ||
      /[\x00-\x1f\x7f]/.test(part))) {
    fail('A source path has traversal or control characters.');
  }
  if (parts.some((part) => excludedNames.has(part))) {
    fail('A source path is in an excluded directory.');
  }
  if (!inside(repoRoot, resolve(repoRoot, ...parts))) {
    fail('A source path escapes the repository root.');
  }
  return parts;
};

const inside = (root, candidate) => {
  const remaining = relative(root, candidate);
  return remaining !== '' && remaining !== '..' && !remaining.startsWith(`..${sep}`) && !isAbsolute(remaining);
};

const readRepoFile = async (path) => {
  const parts = validatePath(path);
  const candidate = resolve(repoRoot, ...parts);
  if (!inside(repoRoot, candidate)) fail('The repository path escapes its root.');
  let current = repoRoot;
  for (const part of parts) {
    current = join(current, part);
    const stat = await lstat(current).catch(() => fail('A referenced repository file is missing.'));
    if (stat.isSymbolicLink()) fail('A referenced repository path is a symlink.');
  }
  const actual = await realpath(candidate);
  if (!inside(repoRoot, actual)) fail('The repository path escapes its root.');
  return readFile(actual, 'utf8');
};

const parseRecord = (schema, text, label) => {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    fail(`${label} is not valid JSON.`);
  }
  const result = schema.safeParse(parsed);
  if (!result.success) fail(`${label} does not match the evidence format.`);
  return result.data;
};

const requireUnique = (values, label) => {
  const folded = values.map((value) => value.toLowerCase());
  if (new Set(folded).size !== values.length) fail(`${label} contains a duplicate or case collision.`);
};

const git = async (...args) => {
  try {
    const { stdout } = await execFileAsync('git', args, { cwd: repoRoot });
    return stdout.trim();
  } catch {
    fail('A referenced Git commit or ancestry check failed.');
  }
};

const gitObject = async (commit) => git('cat-file', '-t', commit);

const requireAncestor = async (older, newer) => {
  await git('merge-base', '--is-ancestor', older, newer);
};

const gitFileHash = async (commit, path) => {
  const child = spawn('git', ['show', `${commit}:${path}`], {
    cwd: repoRoot, stdio: ['ignore', 'pipe', 'ignore'],
  });
  const hash = createHash('sha256');
  for await (const chunk of child.stdout) hash.update(chunk);
  const [code] = await once(child, 'close');
  if (code !== 0) fail('A recovery file is unavailable in its checkpoint.');
  return hash.digest('hex');
};

const verifyCheckpoint = async (recovery) => {
  const changed = (await git('diff', '--name-only', '-z', '--no-renames',
    recovery.baseCommit, recovery.checkpointCommit)).split('\0').filter(Boolean);
  for (const path of changed) validateSourcePath(path);
  if (changed.length !== recovery.inventory.length ||
      changed.some((path) => !recovery.inventory.some((entry) => entry.path === path))) {
    fail('The recovery inventory differs from the checkpoint changes.');
  }
  for (const entry of recovery.inventory) {
    const treeEntry = await git('ls-tree', recovery.checkpointCommit, '--', entry.path);
    if (entry.kind === 'deletion') {
      if (treeEntry !== '' || entry.mode !== null || entry.sha256 !== null) {
        fail('A recovery deletion differs from its checkpoint.');
      }
      continue;
    }
    const mode = treeEntry.split(' ')[0];
    if (mode !== entry.mode || (entry.kind === 'symlink') !== (mode === '120000') ||
        entry.sha256 !== await gitFileHash(recovery.checkpointCommit, entry.path)) {
      fail('A recovery file differs from its checkpoint.');
    }
  }
};

const validateReview = async (status, path, runId) => {
  if (status === 'complete') {
    if (unknown(path) || path === null) fail('A complete review needs a review file.');
    validatePath(path);
    if (!path.startsWith(`evidence/runs/${runId}/reviews/`) || !path.endsWith('.md')) {
      fail('A review file is outside its run review directory.');
    }
    await readRepoFile(path);
  } else if (typeof path === 'string') {
    fail('A review file cannot be attached before review completion.');
  }
};

const requireAssetSource = (source, assets) => {
  validatePath(source.tag, true);
  validatePath(source.name, true);
  if (!assets.some((asset) => asset.kind === 'log' &&
      asset.tag === source.tag && asset.name === source.name)) {
    fail('An identity observation lacks its verified log asset.');
  }
};

const requireAssetReference = (reference, assets, kind = null) => {
  validatePath(reference.tag, true);
  validatePath(reference.name, true);
  if (unknown(assets) || !assets.some((asset) =>
    asset.tag === reference.tag && asset.name === reference.name &&
    (kind === null || asset.kind === kind))) {
    fail('An evidence reference lacks its declared asset.');
  }
};

const validateAttempt = async (attempt, expectedRunId, expectedActor, prerequisites, assetRoot) => {
  if (attempt.runId !== expectedRunId) fail('An attempt belongs to another run.');
  validatePath(attempt.scenarioId, true);
  validatePath(attempt.attemptId, true);
  if (!/^[a-z0-9_]+$/.test(attempt.branch)) fail('An attempt branch is invalid.');
  if (await gitObject(attempt.baseCommit) !== 'commit') fail('The attempt base is not a commit.');
  if (await gitObject(attempt.lastDurableCommit) !== 'commit') {
    fail('The last durable state is not a commit.');
  }
  const branchTip = await git('rev-parse', `refs/heads/${attempt.branch}`);
  if (branchTip !== attempt.lastDurableCommit) fail('The attempt branch moved past its recorded state.');
  await requireAncestor(attempt.baseCommit, attempt.lastDurableCommit);
  if (attempt.finalCommit !== null && attempt.finalCommit !== attempt.lastDurableCommit) {
    fail('The final and last durable commit differ.');
  }
  if (attempt.actorOutcome === 'interrupted' && attempt.evidenceStatus !== 'incomplete') {
    fail('An interrupted attempt cannot claim complete evidence.');
  }
  if (attempt.actorOutcome === 'interrupted' && attempt.finalCommit !== null) {
    fail('An interrupted attempt cannot claim a final actor commit.');
  }
  if ((attempt.actorOutcome === 'unknown') !== (attempt.outcomeReason !== null)) {
    fail('An unknown outcome needs a reason; a known outcome does not.');
  }
  await validateReview(attempt.reviewStatus, attempt.review, expectedRunId);

  if (!unknown(attempt.scenarioDefinition)) {
    validatePath(attempt.scenarioDefinition.path);
    if (await gitObject(attempt.scenarioDefinition.commit) !== 'commit') {
      fail('The scenario revision is not a commit.');
    }
    if (await git('cat-file', '-t',
      `${attempt.scenarioDefinition.commit}:${attempt.scenarioDefinition.path}`) !== 'blob') {
      fail('The scenario revision does not identify a file.');
    }
  }

  const sessionIds = attempt.sessions.map((session) => session.id);
  requireUnique(sessionIds, 'Session IDs');
  requireUnique(attempt.redactions.map((record) => record.id), 'Redaction IDs');
  for (const redaction of attempt.redactions) {
    for (const location of redaction.affectedLocations) validatePath(location);
  }
  if (!unknown(attempt.checks)) {
    for (const check of attempt.checks) {
      for (const artifact of check.coveredArtifacts) validatePath(artifact);
      if (check.asset !== null) requireAssetReference(check.asset, attempt.assets);
    }
  }
  if (!unknown(attempt.installations)) {
    requireUnique(attempt.installations.map((entry) => `${entry.sessionId}:${entry.eventOrdinal}`),
      'Installation observations');
  }
  if (!unknown(attempt.requests)) {
    requireUnique(attempt.requests.map((request) => request.id), 'Request IDs');
    requireUnique(attempt.requests.map((request) => `${request.sessionId}:${request.eventOrdinal}`),
      'Request event locators');
    let previousCommit = attempt.baseCommit;
    const previousEventBySession = new Map();
    for (const [index, request] of attempt.requests.entries()) {
      if (request.ordinal !== index + 1 || !sessionIds.includes(request.sessionId)) {
        fail('Request order or session identity is invalid.');
      }
      const previousEvent = previousEventBySession.get(request.sessionId);
      if (previousEvent !== undefined && request.eventOrdinal <= previousEvent) {
        fail('Requests are out of native session order.');
      }
      previousEventBySession.set(request.sessionId, request.eventOrdinal);
      if (request.beforeCommit !== previousCommit) fail('Request checkpoints are out of order.');
      if (request.afterCommit !== null) {
        await requireAncestor(request.beforeCommit, request.afterCommit);
        await requireAncestor(request.afterCommit, attempt.lastDurableCommit);
        previousCommit = request.afterCommit;
      } else if (attempt.actorOutcome !== 'interrupted') {
        fail('Only an interrupted request may lack an after-commit.');
      }
      for (const id of request.redactionIds) {
        if (!attempt.redactions.some((record) => record.id === id)) {
          fail('A request cites a missing redaction.');
        }
      }
    }
    if (attempt.finalCommit !== null && previousCommit !== attempt.finalCommit) {
      fail('The final commit lacks a matching request checkpoint.');
    }
  }
  if (!unknown(attempt.interventions)) {
    requireUnique(attempt.interventions.map((entry) => entry.interventionRequestId),
      'Intervention request IDs');
    for (const intervention of attempt.interventions) {
      const original = unknown(attempt.requests) ? null :
        attempt.requests.find((entry) => entry.id === intervention.requestId);
      const assisted = unknown(attempt.requests) ? null :
        attempt.requests.find((entry) => entry.id === intervention.interventionRequestId);
      if (!original || !assisted || assisted.kind !== 'intervention' ||
          assisted.ordinal <= original.ordinal ||
          intervention.originalCommit !== original.afterCommit ||
          intervention.assistedCommit !== assisted.afterCommit) {
        fail('An intervention does not link its original and assisted requests.');
      }
    }
  }
  if (!unknown(attempt.failures)) {
    for (const failure of attempt.failures) {
      if (!unknown(attempt.requests) && failure.requestId !== null &&
          !attempt.requests.some((request) => request.id === failure.requestId)) {
        fail('A failure cites a missing request.');
      }
      if (failure.asset !== null) requireAssetReference(failure.asset, attempt.assets);
    }
  }
  if (!unknown(attempt.recovery) && attempt.recovery !== null) {
    const recovery = attempt.recovery;
    if (attempt.actorOutcome !== 'interrupted') fail('Only an interrupted attempt has recovery state.');
    if (recovery.kind === 'checkpoint') {
      if (recovery.checkpointCommit !== attempt.lastDurableCommit || recovery.asset !== null) {
        fail('The recovery checkpoint differs from the branch state.');
      }
      await requireAncestor(recovery.baseCommit, recovery.checkpointCommit);
    } else if (recovery.baseCommit !== attempt.lastDurableCommit ||
        recovery.checkpointCommit !== null || recovery.asset === null) {
      fail('A recovery asset has an invalid base or locator.');
    }
    if (recovery.kind === 'asset') requireAssetReference(recovery.asset, attempt.assets, 'recovery');
    requireUnique(recovery.inventory.map((entry) => entry.path), 'Recovery paths');
    for (const entry of recovery.inventory) validateSourcePath(entry.path);
    if (recovery.kind === 'checkpoint' && recovery.verified) await verifyCheckpoint(recovery);
    if (recovery.verified && recovery.gaps.length > 0) fail('A recovery claim has missing material.');
    if (recovery.verified) {
      const inputCommit = recovery.kind === 'checkpoint' ?
        recovery.checkpointCommit : recovery.baseCommit;
      const artifact = recovery.kind === 'checkpoint' ?
        `git/${recovery.baseCommit}/${recovery.checkpointCommit}` :
        `${recovery.asset.tag}/${recovery.asset.name}`;
      const hasRestorationCheck = !unknown(attempt.checks) && attempt.checks.some((check) =>
        check.kind === 'manual' && check.description === 'recovery restoration' &&
        check.result === 'passed' && check.inputCommit === inputCommit &&
        check.coveredArtifacts.includes(artifact) &&
        (recovery.kind === 'checkpoint' ? check.asset === null :
          check.asset !== null && check.asset.tag === recovery.asset.tag &&
          check.asset.name === recovery.asset.name));
      if (!hasRestorationCheck) fail('A recovery claim lacks a matching restoration check.');
    }
    if (recovery.verified && recovery.kind === 'asset' && !assetRoot) {
      fail('A recovery asset needs downloaded bytes for verification.');
    }
  }

  if (attempt.evidenceStatus === 'complete') {
    if (attempt.finalCommit === null || attempt.actorOutcome === 'pending' ||
        attempt.actorOutcome === 'unknown' || unknown(attempt.requests) ||
        unknown(attempt.scenarioDefinition) ||
        unknown(attempt.ignoredDeveloperEvents) || unknown(attempt.assets) ||
        unknown(attempt.checks) || unknown(attempt.installations) ||
        unknown(attempt.interventions) || unknown(attempt.failures) ||
        unknown(attempt.skillRelease) || unknown(expectedActor) || unknown(prerequisites) ||
        attempt.requests.length === 0 ||
        attempt.installations.length === 0 ||
        attempt.assets.length === 0 || !assetRoot) {
      fail('A complete attempt lacks required durable evidence.');
    }
    if (expectedActor.model !== requiredActor.model ||
        expectedActor.effort !== requiredActor.effort) {
      fail('A complete attempt has the wrong required actor settings.');
    }
    const prerequisiteByComponent = new Map(prerequisites.map((entry) =>
      [entry.component, entry]));
    requireUnique(prerequisites.map((entry) => entry.component), 'Release prerequisites');
    const cliPrerequisite = prerequisiteByComponent.get('cli');
    const corePrerequisite = prerequisiteByComponent.get('core');
    const skillPrerequisite = prerequisiteByComponent.get('skill');
    if (!cliPrerequisite || !corePrerequisite || !skillPrerequisite ||
        unknown(cliPrerequisite.integrity) || unknown(corePrerequisite.integrity) ||
        unknown(skillPrerequisite.integrity) ||
        attempt.skillRelease !== skillPrerequisite.version) {
      fail('A complete attempt lacks matching release prerequisites.');
    }
    const requiredPrivacyCoverage = [
      'evidence/index.json',
      `evidence/runs/${attempt.runId}/run.json`,
      `evidence/runs/${attempt.runId}/attempts/${attempt.attemptId}.json`,
      attempt.scenarioDefinition.path,
      `git/${attempt.baseCommit}/${attempt.lastDurableCommit}`,
      ...attempt.assets.map((asset) => `${asset.tag}/${asset.name}`),
      ...(typeof attempt.review === 'string' ? [attempt.review] : []),
    ];
    if (!attempt.checks.some((check) => check.kind === 'manual' &&
        check.description === 'privacy review' && check.result === 'passed' &&
        check.inputCommit === attempt.lastDurableCommit &&
        requiredPrivacyCoverage.every((artifact) => check.coveredArtifacts.includes(artifact)))) {
      fail('A complete attempt lacks a recorded privacy review.');
    }
    if (attempt.actorOutcome === 'failed' && attempt.failures.length === 0) {
      fail('A failed attempt lacks a failure record.');
    }
    for (const request of attempt.requests.filter((entry) => entry.kind === 'intervention')) {
      if (!attempt.interventions.some((entry) => entry.interventionRequestId === request.id)) {
        fail('An intervention request lacks its original and assisted results.');
      }
    }
    if (attempt.installations.length !== attempt.sessions.reduce((count, session) =>
      count + (unknown(session.turns) ? 0 : session.turns.length), 0)) {
      fail('Installed composition observations do not match the session turns.');
    }
    for (const session of attempt.sessions) {
      if (unknown(session.turns) || session.turns.length === 0 || unknown(session.hostVersion) ||
          attempt.assets.filter((asset) => asset.kind === 'session' && asset.sessionId === session.id).length !== 1) {
        fail('A complete attempt lacks a session export or effective settings.');
      }
      for (const turn of session.turns) {
        const installation = attempt.installations.find((entry) => entry.sessionId === session.id &&
          entry.eventOrdinal === turn.eventOrdinal);
        if (!installation) {
          fail('A complete turn lacks an installed composition observation.');
        }
        requireAssetSource(installation.source, attempt.assets);
        if (installation.cli.version !== cliPrerequisite.version ||
            installation.core.version !== corePrerequisite.version ||
            installation.skill.ref !== skillPrerequisite.version) {
          fail('An installed composition differs from the release prerequisites.');
        }
        if (unknown(turn.effectiveModel) || unknown(turn.effectiveEffort) ||
            unknown(turn.requestedModel) || unknown(turn.requestedEffort) ||
            unknown(turn.deviation) ||
            turn.deviation !== (turn.requestedModel !== expectedActor.model ||
              turn.requestedEffort !== expectedActor.effort ||
              turn.effectiveModel !== expectedActor.model ||
              turn.effectiveEffort !== expectedActor.effort)) {
          fail('A turn has missing or inconsistent effective settings.');
        }
      }
    }
  }

  if (!unknown(attempt.assets) && attempt.assets.length > 0 && !assetRoot) {
    fail('Declared assets need downloaded bytes for integrity verification.');
  }

  if (!unknown(attempt.assets) && assetRoot) {
    const candidates = attempt.assets.map((asset) => `${asset.tag}/${asset.name}`);
    requireUnique(candidates, 'Asset names');
    const redactionsById = new Map(attempt.redactions.map((record) => [record.id, record]));
    const observedRedactionIds = new Set();
    for (const asset of attempt.assets) {
      await verifyAsset(asset, assetRoot, attempt, redactionsById, observedRedactionIds);
    }
    if (attempt.evidenceStatus === 'complete' &&
        observedRedactionIds.size !== attempt.redactions.length) {
      fail('A declared redaction lacks its session event.');
    }
  }
};

const hashAndReadSession = async (file, onEvent) => {
  const hash = createHash('sha256');
  let sizeBytes = 0;
  const source = createReadStream(file);
  const tally = new Transform({
    transform(chunk, _encoding, callback) {
      hash.update(chunk);
      sizeBytes += chunk.length;
      callback(null, chunk);
    },
  });
  if (onEvent) {
    const gunzip = createGunzip();
    const copying = pipeline(source, tally, gunzip);
    try {
      for await (const line of createInterface({ input: gunzip, crlfDelay: Infinity })) {
        if (line.trim() === '') continue;
        let event;
        try {
          event = JSON.parse(line);
        } catch {
          fail('A session asset has invalid JSONL.');
        }
        onEvent(event);
      }
      await copying;
    } catch (error) {
      source.destroy();
      gunzip.destroy();
      await copying.catch(() => {});
      if (error instanceof EvidenceError) throw error;
      fail('A session asset could not be read.');
    }
  } else {
    await pipeline(source, tally, new Writable({
      write(_chunk, _encoding, callback) { callback(); },
    }));
  }
  return { sha256: hash.digest('hex'), sizeBytes };
};

const extractRequest = (event) => {
  if (event.kind !== 'message' || event.payload.role !== 'developer') return null;
  const content = event.payload.content;
  if (!Array.isArray(content) || content.some((part) => part.type !== 'input_text' ||
      typeof part.text !== 'string')) {
    fail('A developer message has unsupported content.');
  }
  return content.map((part) => part.text).join('\n');
};

const hasRedactedField = (event, path) => {
  let field = event;
  for (const part of path) {
    if (field === null || typeof field !== 'object' || !Object.hasOwn(field, part)) return false;
    field = field[part];
  }
  return typeof field === 'string' && field.includes('[redacted]');
};

const verifyAsset = async (asset, assetRoot, attempt, redactionsById, observedRedactionIds) => {
  validatePath(asset.tag, true);
  validatePath(asset.name, true);
  const assetPath = resolve(assetRoot, asset.tag, asset.name);
  if (!inside(assetRoot, assetPath)) fail('An asset path escapes its root.');
  const actual = await realpath(assetPath).catch(() => fail('A declared asset is unavailable.'));
  if (!inside(assetRoot, actual)) fail('An asset path escapes its root.');
  const identities = [];
  const effectiveTurns = [];
  const developerEvents = new Map();
  let firstOrdinal = null;
  let lastOrdinal = null;
  const onEvent = asset.kind === 'session' ? (event) => {
    if (!Number.isInteger(event.ordinal) || event.ordinal < 0 ||
        (lastOrdinal !== null && event.ordinal <= lastOrdinal)) {
      fail('Session event ordinals are invalid or out of order.');
    }
    firstOrdinal ??= event.ordinal;
    lastOrdinal = event.ordinal;
    if (event.kind === 'session') identities.push(event.payload);
    if (event.kind === 'turn') effectiveTurns.push(event);
    if (!Array.isArray(event.redactionIds)) fail('A session redaction has no manifest record.');
    for (const id of event.redactionIds) {
      const record = redactionsById.get(id);
      if (!record) fail('A session redaction has no manifest record.');
      if (record.sessionId !== asset.sessionId || record.eventOrdinal !== event.ordinal ||
          observedRedactionIds.has(id) ||
          !hasRedactedField(event, record.path)) {
        fail('A redaction locator differs from its session event.');
      }
      observedRedactionIds.add(id);
    }
    const requestText = extractRequest(event);
    if (requestText !== null) developerEvents.set(event.ordinal, {
      text: requestText, redactionIds: event.redactionIds,
    });
  } : null;
  const result = await hashAndReadSession(actual, onEvent);
  if (result.sha256 !== asset.sha256 || result.sizeBytes !== asset.sizeBytes) {
    fail('An asset has the wrong size or SHA-256.');
  }
  if (asset.kind !== 'session') return;
  if (firstOrdinal !== asset.firstEventOrdinal || lastOrdinal !== asset.lastEventOrdinal) {
    fail('Session event coverage differs from its asset record.');
  }
  const session = attempt.sessions.find((entry) => entry.id === asset.sessionId);
  if (!session) fail('A session asset has no matching attempt session.');
  if (identities.length !== 1 || identities[0]?.sessionId !== session.id ||
      (!unknown(session.hostVersion) && identities[0]?.hostVersion !== session.hostVersion)) {
    fail('A session asset identity differs from its manifest.');
  }
  if (!unknown(session.turns)) {
    if (effectiveTurns.length !== session.turns.length || effectiveTurns.some((event, index) =>
      event.ordinal !== session.turns[index].eventOrdinal ||
      (!unknown(session.turns[index].effectiveModel) &&
        event.payload?.model !== session.turns[index].effectiveModel) ||
      (!unknown(session.turns[index].effectiveEffort) &&
        event.payload?.effort !== session.turns[index].effectiveEffort))) {
      fail('Effective turn settings differ from the session asset.');
    }
  }
  const requests = unknown(attempt.requests) ? [] : attempt.requests.filter(
    (request) => request.sessionId === asset.sessionId,
  );
  const ignored = unknown(attempt.ignoredDeveloperEvents) ? [] :
    attempt.ignoredDeveloperEvents.filter((entry) => entry.sessionId === asset.sessionId);
  for (const request of requests) {
    const event = developerEvents.get(request.eventOrdinal);
    if (!event || event.text !== request.text) {
      fail('A request differs from its recorded session event.');
    }
    const eventRedactions = event.redactionIds ?? [];
    if (JSON.stringify(eventRedactions) !== JSON.stringify(request.redactionIds)) {
      fail('A request redaction reference differs from its session event.');
    }
  }
  if (attempt.evidenceStatus === 'complete') {
    for (const ordinal of developerEvents.keys()) {
      if (!requests.some((entry) => entry.eventOrdinal === ordinal) &&
          !ignored.some((entry) => entry.eventOrdinal === ordinal)) {
        fail('A developer message lacks a request or exclusion record.');
      }
    }
    for (const entry of ignored) {
      if (!developerEvents.has(entry.eventOrdinal) ||
          requests.some((request) => request.eventOrdinal === entry.eventOrdinal)) {
        fail('An ignored developer event locator is invalid.');
      }
    }
  }
};

const verify = async (options) => {
  const runPath = options.get('--run');
  if (!runPath) fail('The verify command requires --run.');
  const run = parseRecord(RunSchema, await readRepoFile(runPath), 'Run manifest');
  validatePath(run.runId, true);
  if (runPath !== `evidence/runs/${run.runId}/run.json`) fail('The run path and ID differ.');
  const index = parseRecord(IndexSchema, await readRepoFile('evidence/index.json'), 'Evidence index');
  requireUnique(index.runs.map((entry) => entry.runId), 'Run IDs');
  const indexed = index.runs.find((entry) => entry.runId === run.runId);
  if (!indexed || indexed.manifestPath !== runPath || indexed.summary !== run.summary ||
      indexed.evidenceStatus !== run.evidenceStatus || indexed.reviewStatus !== run.reviewStatus) {
    fail('The index and run manifest disagree.');
  }
  await validateReview(run.reviewStatus, run.review, run.runId);
  if (run.evidenceStatus === 'complete') {
    if (unknown(run.prerequisites) ||
        ['core', 'cli', 'skill'].some((component) => !run.prerequisites.some((entry) =>
          entry.component === component && !unknown(entry.integrity)))) {
      fail('A complete run lacks verified release prerequisites.');
    }
  }
  requireUnique(run.attempts, 'Attempt paths');
  const assetRootOption = options.get('--asset-root');
  const assetRoot = assetRootOption ? await realpath(assetRootOption) : null;
  if (assetRoot) rejectExcludedLocation(assetRoot);
  const attempts = [];
  for (const attemptPath of run.attempts) {
    validatePath(attemptPath);
    if (!attemptPath.startsWith(`evidence/runs/${run.runId}/attempts/`)) {
      fail('An attempt path is outside its run.');
    }
    const attempt = parseRecord(AttemptSchema, await readRepoFile(attemptPath), 'Attempt manifest');
    if (attemptPath !== `evidence/runs/${run.runId}/attempts/${attempt.attemptId}.json`) {
      fail('An attempt path and ID differ.');
    }
    await validateAttempt(attempt, run.runId, run.expectedActor, run.prerequisites, assetRoot);
    attempts.push(attempt);
  }
  requireUnique(attempts.map((attempt) => attempt.attemptId), 'Attempt IDs');
  if (attempts.some((attempt) => attempt.evidenceStatus === 'complete')) {
    const assets = attempts.flatMap((attempt) => attempt.assets);
    for (const prerequisite of run.prerequisites) requireAssetSource(prerequisite.source, assets);
  }
  if (run.evidenceStatus === 'complete' && attempts.some((attempt) => attempt.evidenceStatus !== 'complete')) {
    fail('A complete run contains incomplete attempts.');
  }
  if (run.reviewStatus === 'complete' && attempts.some((attempt) => attempt.reviewStatus !== 'complete')) {
    fail('A complete run review does not cover every attempt.');
  }
  if (run.reviewStatus === 'complete' && !attempts.some((attempt) =>
    !unknown(attempt.checks) && attempt.checks.some((check) => check.kind === 'manual' &&
      check.description === 'privacy review' && check.result === 'passed' &&
      check.coveredArtifacts.includes(run.review)))) {
    fail('A complete run review lacks recorded privacy coverage.');
  }
  process.stdout.write(`Verified ${run.runId}: ${attempts.length} attempt(s); evidence ${run.evidenceStatus}.\n`);
};

/** Keeps the readable context supplied at compaction while excluding encrypted host state. */
const projectCompaction = (payload) => {
  if (typeof payload.message !== 'string' || !Array.isArray(payload.replacement_history) ||
      !payload.retained_context || !Array.isArray(payload.retained_context.user_messages)) {
    fail('A native compaction has unsupported context.');
  }
  const replacementHistory = [];
  let encryptedSummaryOmitted = false;
  for (const item of payload.replacement_history) {
    if (item?.type === 'compaction' && typeof item.encrypted_content === 'string') {
      encryptedSummaryOmitted = true;
    } else if (item?.type === 'message' && typeof item.role === 'string' &&
        Array.isArray(item.content)) {
      replacementHistory.push({ role: item.role, content: item.content });
    } else {
      fail('A native compaction replacement has unsupported content.');
    }
  }
  const retainedUserMessages = payload.retained_context.user_messages.map((item) => {
    if (!Number.isInteger(item?.order) || typeof item.turn_id !== 'string' ||
        typeof item.message_id !== 'string' || typeof item.text !== 'string' ||
        typeof item.complete !== 'boolean') {
      fail('A native compaction retained message has unsupported content.');
    }
    return {
      order: item.order,
      turnId: item.turn_id,
      messageId: item.message_id,
      text: item.text,
      complete: item.complete,
    };
  });
  return {
    message: payload.message,
    replacementHistory,
    retainedUserMessages,
    encryptedSummaryOmitted,
  };
};

const projectEvent = (record, ordinal, includeBaseInstructions) => {
  const payload = record.payload;
  if (!payload || typeof payload !== 'object') fail('A native event has no payload.');
  const base = { ordinal, timestamp: record.timestamp, redactionIds: [] };
  if (record.type === 'session_meta') {
    if (typeof payload.id !== 'string' || typeof payload.cli_version !== 'string') {
      fail('Native session identity or host version is unavailable.');
    }
    const instructions = payload.base_instructions;
    const instructionText = typeof instructions === 'string' ? instructions : instructions?.text;
    if (includeBaseInstructions && typeof instructionText !== 'string') {
      fail('Native base instructions are unavailable as text.');
    }
    return { ...base, kind: 'session', payload: {
      sessionId: payload.id,
      hostVersion: payload.cli_version,
      ...(includeBaseInstructions ? { baseInstructions: instructionText } : {}),
    } };
  }
  if (record.type === 'turn_context') {
    if (typeof payload.model !== 'string' || typeof payload.effort !== 'string') {
      fail('Effective turn settings are unavailable.');
    }
    return { ...base, kind: 'turn', payload: {
      rootTurnId: payload.root_turn_id,
      model: payload.model,
      effort: payload.effort,
    } };
  }
  if (record.type === 'response_item') {
    if (payload.type === 'reasoning') return null;
    if (payload.type === 'message') {
      if (typeof payload.role !== 'string' || !Array.isArray(payload.content)) {
        fail('A native message has unsupported content.');
      }
      return { ...base, kind: 'message', payload: {
        role: payload.role,
        content: payload.content,
      } };
    }
    if (payload.type === 'custom_tool_call') {
      if (typeof payload.name !== 'string' || typeof payload.call_id !== 'string' ||
          typeof payload.input !== 'string') {
        fail('A native tool call has unsupported fields.');
      }
      return { ...base, kind: 'tool-call', payload: {
        name: payload.name,
        callId: payload.call_id,
        input: payload.input,
        status: payload.status,
      } };
    }
    if (payload.type === 'custom_tool_call_output') {
      if (typeof payload.call_id !== 'string' || payload.output === undefined) {
        fail('A native tool result has unsupported fields.');
      }
      return { ...base, kind: 'tool-result', payload: {
        callId: payload.call_id,
        output: payload.output,
      } };
    }
    fail('A native response type needs manual inspection.');
  }
  if (record.type === 'compacted') {
    return { ...base, kind: 'compaction', payload: projectCompaction(payload) };
  }
  if (record.type === 'event_msg') {
    if (payload.type === 'task_started' || payload.type === 'task_complete') {
      return { ...base, kind: payload.type, payload: { turnId: payload.turn_id } };
    }
    if (['item_completed', 'token_count', 'thread_settings_applied'].includes(payload.type)) return null;
    fail('A native event type needs manual inspection.');
  }
  if (record.type === 'world_state' || record.type === 'token_usage_record') return null;
  fail('A native record type needs manual inspection.');
};

const redactEvent = (event, rules) => {
  const grouped = new Map();
  for (const rule of rules) {
    const key = JSON.stringify(rule.path);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(rule);
  }
  for (const group of grouped.values()) {
    const path = group[0].path;
    let parent = event;
    for (const part of path.slice(0, -1)) {
      if (parent === null || typeof parent !== 'object' || !(part in parent)) {
        fail('A redaction field is unavailable.');
      }
      parent = parent[part];
    }
    const last = path.at(-1);
    if (parent === null || typeof parent !== 'object' || typeof parent[last] !== 'string') {
      fail('A redaction must target text.');
    }
    const original = parent[last];
    if (group.some((rule) => rule.start === undefined || rule.end === undefined)) {
      if (group.length !== 1 || group[0].start !== undefined || group[0].end !== undefined) {
        fail('A whole-field redaction cannot overlap another rule.');
      }
      parent[last] = '[redacted]';
    } else {
      const ordered = [...group].sort((left, right) => right.start - left.start);
      let nextStart = original.length;
      let sanitized = original;
      for (const rule of ordered) {
        if (rule.end > nextStart || rule.start >= rule.end || rule.end > original.length) {
          fail('Redaction ranges overlap or exceed the selected text.');
        }
        sanitized = `${sanitized.slice(0, rule.start)}[redacted]${sanitized.slice(rule.end)}`;
        nextStart = rule.start;
      }
      parent[last] = sanitized;
    }
    event.redactionIds.push(...group.map((rule) => rule.id));
  }
  event.redactionIds.sort();
};

const capture = async (options) => {
  const sessionPath = options.get('--session');
  const outputRoot = options.get('--output-root');
  const name = options.get('--name');
  const redactionsPath = options.get('--redactions');
  if (!sessionPath || !outputRoot || !name || !redactionsPath) {
    fail('Capture requires --session, --output-root, --name and --redactions.');
  }
  validatePath(name, true);
  validatePath(`${name}.meta.json`, true);
  validatePath(`${name}.partial`, true);
  if (!name.endsWith('.jsonl.gz')) fail('A capture name must end in .jsonl.gz.');
  for (const selectedPath of [sessionPath, redactionsPath]) rejectExcludedLocation(selectedPath);
  const resolvedSession = await realpath(sessionPath);
  const resolvedRules = await realpath(redactionsPath);
  for (const selectedPath of [resolvedSession, resolvedRules]) rejectExcludedLocation(selectedPath);
  const rules = parseRecord(CaptureRulesSchema, await readFile(resolvedRules, 'utf8'), 'Redaction rules');
  requireUnique(rules.rules.map((rule) => rule.id), 'Redaction rules');
  const rulesByOrdinal = new Map();
  for (const rule of rules.rules) {
    const selected = rulesByOrdinal.get(rule.eventOrdinal) ?? [];
    selected.push(rule);
    rulesByOrdinal.set(rule.eventOrdinal, selected);
  }
  const outputDirectory = await realpath(outputRoot);
  rejectExcludedLocation(outputDirectory);
  const stat = await lstat(outputDirectory);
  if (!stat.isDirectory()) fail('The output root is not a directory.');
  const outputPath = join(outputDirectory, name);
  const metaPath = join(outputDirectory, `${name}.meta.json`);
  const partialPath = join(outputDirectory, `${name}.partial`);
  for (const path of [outputPath, metaPath, partialPath]) {
    const present = await lstat(path).then(() => true, () => false);
    if (present) fail('A capture output already exists.');
  }
  const hash = createHash('sha256');
  let sizeBytes = 0;
  const gzip = createGzip();
  const tally = new Transform({
    transform(chunk, _encoding, callback) {
      hash.update(chunk);
      sizeBytes += chunk.length;
      callback(null, chunk);
    },
  });
  const writing = pipeline(gzip, tally, createWriteStream(partialPath, { flags: 'wx' }));
  const applied = new Set();
  const requests = [];
  const omissions = new Set();
  let sessionId = null;
  let hostVersion = null;
  let firstEventOrdinal = null;
  let lastEventOrdinal = null;
  let eventCount = 0;
  try {
    let ordinal = 0;
    const input = createInterface({ input: createReadStream(resolvedSession), crlfDelay: Infinity });
    for await (const line of input) {
      let record;
      try {
        record = JSON.parse(line);
      } catch {
        fail('A native session event is not valid JSON.');
      }
      const nativeResult = NativeRecordSchema.safeParse(record);
      if (!nativeResult.success) fail('A native session event has unsupported fields.');
      record = nativeResult.data;
      const event = projectEvent(record, ordinal, rules.includeBaseInstructions);
      if (event) {
        const eventRules = rulesByOrdinal.get(ordinal) ?? [];
        redactEvent(event, eventRules);
        for (const rule of eventRules) applied.add(rule.id);
        const requestText = extractRequest(event);
        if (requestText !== null) {
          requests.push({ eventOrdinal: ordinal, text: requestText, redactionIds: event.redactionIds });
        }
        if (event.kind === 'session') {
          if (sessionId !== null) fail('The input contains multiple native sessions.');
          sessionId = event.payload.sessionId;
          hostVersion = event.payload.hostVersion;
          if (!rules.includeBaseInstructions) omissions.add('base instructions omitted');
        }
        if (event.kind === 'compaction' && event.payload.encryptedSummaryOmitted) {
          omissions.add('encrypted compaction summary omitted');
        }
        firstEventOrdinal ??= ordinal;
        lastEventOrdinal = ordinal;
        eventCount += 1;
        if (!gzip.write(`${JSON.stringify(event)}\n`)) await once(gzip, 'drain');
      } else if (rulesByOrdinal.has(ordinal)) {
        fail('A redaction targets an omitted native event.');
      }
      ordinal += 1;
    }
    if (sessionId === null || applied.size !== rules.rules.length) {
      fail('The session identity or a requested redaction is missing.');
    }
    gzip.end();
    await writing;
    const metadata = {
      formatVersion: 1,
      sessionId,
      hostVersion,
      eventCount,
      firstEventOrdinal,
      lastEventOrdinal,
      asset: { name, sizeBytes, sha256: hash.digest('hex'), mediaType: 'application/jsonl+gzip' },
      requests,
      redactions: rules.rules.map((rule) => ({
        id: rule.id,
        reason: rule.reason,
        eventOrdinal: rule.eventOrdinal,
        path: rule.path,
      })),
      omissions: [...omissions, 'encrypted reasoning and host-private world state omitted'],
    };
    await rename(partialPath, outputPath);
    await writeFile(metaPath, `${JSON.stringify(metadata, null, 2)}\n`, { flag: 'wx' });
    process.stdout.write(`Captured ${eventCount} shareable events; inspect the output before use.\n`);
  } catch (error) {
    gzip.destroy();
    await writing.catch(() => {});
    await rm(partialPath, { force: true });
    await rm(outputPath, { force: true });
    await rm(metaPath, { force: true });
    if (error instanceof EvidenceError) throw error;
    fail('Capture failed while reading or writing evidence.');
  }
};

const parseOptions = (args) => {
  const options = new Map();
  if (args.length % 2 !== 0) fail('An option is missing its value.');
  for (let index = 0; index < args.length; index += 2) {
    if (!args[index].startsWith('--') || options.has(args[index])) fail('An option is invalid or repeated.');
    options.set(args[index], args[index + 1]);
  }
  return options;
};

const main = async () => {
  const [command, ...args] = process.argv.slice(2);
  const options = parseOptions(args);
  if (command === 'capture') {
    if ([...options.keys()].some((option) => !['--session', '--output-root', '--name', '--redactions'].includes(option))) {
      fail('Capture received an unsupported option.');
    }
    await capture(options);
  } else if (command === 'verify') {
    if ([...options.keys()].some((option) => !['--run', '--asset-root', '--repo-root'].includes(option))) {
      fail('Verify received an unsupported option.');
    }
    if (options.has('--repo-root')) repoRoot = await realpath(options.get('--repo-root'));
    rejectExcludedLocation(repoRoot);
    await verify(options);
  } else {
    fail('Use capture or verify.');
  }
};

await main().catch((error) => {
  process.stderr.write(`${error instanceof EvidenceError ? error.message : 'Evidence operation failed.'}\n`);
  process.exitCode = 1;
});
