import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  createShutdownSignal, isProcessRunning, reservePort, startProcessAndWait, stopProcessTree,
} from 'jg-process';
import { eveCli, eveEnvironment, projectRoot, runEve } from './eve.ts';

const shutdown = createShutdownSignal();
// eve eval --url is a remote target even for our owned loopback listener.
// The documented explicit override bypasses ambient Vercel discovery. It is
// intentionally non-secret: our fictional local channel permits anonymous access.
// Assign last so a real inherited EVE_EVAL_AUTH_TOKEN is never passed through.
const runtimeEnvironment = {
  ...eveEnvironment,
  EVE_EVAL_AUTH_TOKEN: 'quarry-handover-local-fixture-not-a-secret',
};
const runLocalEve = (args: string[]) => runEve(args, shutdown.signal, runtimeEnvironment);
const recordsPath = resolve(projectRoot, 'data/records.json');
const sourceBefore = await readFile(recordsPath);
const reservation = await reservePort({ host: '127.0.0.1' });
const port = reservation.port;
const url = `http://127.0.0.1:${port}`;
let server: Awaited<ReturnType<typeof startProcessAndWait>> | undefined;

try {
  const help = await runLocalEve(['eval', '--help']);
  for (const option of ['--strict', '--url', '--timeout', '--max-concurrency', '--skip-report', '--verbose']) {
    assert.ok(help.includes(option), `Installed eve eval must support ${option}.`);
  }
  const startHelp = await runLocalEve(['start', '--help']);
  for (const option of ['--host', '--port', '--no-schedules']) assert.ok(startHelp.includes(option));

  const info = JSON.parse(await runLocalEve(['info', '--json']));
  assert.equal(info.status, 'ready');
  assert.deepEqual(info.diagnostics, { errors: 0, warnings: 0 });
  assert.deepEqual(info.tools, ['lookup_records']);
  assert.deepEqual(info.skills, ['handover']);
  assert.deepEqual(info.subagents, []);
  assert.deepEqual(info.schedules, []);
  console.log('Real discovery passed: one root, one lookup, one handover procedure.');

  process.stdout.write(await runLocalEve(['build', '--skip-sandbox-prewarm']));
  await reservation.release();
  server = await startProcessAndWait({
    command: process.execPath,
    args: [eveCli, 'start', '--host', '127.0.0.1', '--port', String(port), '--no-schedules'],
    cwd: projectRoot,
    env: runtimeEnvironment,
    stdio: 'inherit',
  }, {
    readyWhen: { url: `${url}/eve/v1/health` },
    timeoutSeconds: 60,
    signal: shutdown.signal,
  });
  process.stdout.write(await runLocalEve([
    'eval', '--strict', '--url', url, '--timeout', '30000',
    '--max-concurrency', '1', '--skip-report', '--verbose',
  ]));
} catch (error) {
  console.error(error);
  process.exitCode = shutdown.exitCode() ?? 1;
} finally {
  try {
    await reservation.release();
    if (server) {
      await stopProcessTree(server, 5);
      assert.ok(server.pid !== undefined);
      assert.equal(isProcessRunning(server.pid), false, 'Owned Eve process must be gone.');
      const freed = await reservePort({ host: '127.0.0.1', preferredPort: port });
      try { assert.equal(freed.port, port, 'The owned runtime must release its loopback listener.'); }
      finally { await freed.release(); }
      console.log('Shutdown verified: owned process stopped and loopback port released.');
    }
    assert.deepEqual(await readFile(recordsPath), sourceBefore, 'Source records must remain unchanged.');
  } catch (error) {
    console.error(error);
    process.exitCode = shutdown.exitCode() ?? 1;
  } finally {
    shutdown.dispose();
  }
}
