import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  createShutdownSignal, isProcessRunning, reservePort, startProcessAndWait, stopProcessTree,
} from 'jg-process';
import { eveCli, eveEnvironment, projectRoot, runEve } from './eve.ts';

const shutdown = createShutdownSignal();
const recordsPath = resolve(projectRoot, 'data/records.json');
const sourceBefore = await readFile(recordsPath);
const reservation = await reservePort({ host: '127.0.0.1' });
const port = reservation.port;
const url = `http://127.0.0.1:${port}`;
let server: Awaited<ReturnType<typeof startProcessAndWait>> | undefined;

try {
  const help = await runEve(['eval', '--help'], shutdown.signal);
  for (const option of ['--strict', '--url', '--timeout', '--max-concurrency', '--skip-report', '--verbose']) {
    assert.ok(help.includes(option), `Installed eve eval must support ${option}.`);
  }
  const startHelp = await runEve(['start', '--help'], shutdown.signal);
  for (const option of ['--host', '--port', '--no-schedules']) assert.ok(startHelp.includes(option));

  const info = JSON.parse(await runEve(['info', '--json'], shutdown.signal));
  assert.equal(info.status, 'ready');
  assert.deepEqual(info.diagnostics, { errors: 0, warnings: 0 });
  assert.deepEqual(info.tools, ['lookup_records']);
  assert.deepEqual(info.skills, ['handover']);
  assert.deepEqual(info.subagents, []);
  assert.deepEqual(info.schedules, []);
  console.log('Real discovery passed: one root, one lookup, one handover procedure.');

  process.stdout.write(await runEve(['build', '--skip-sandbox-prewarm'], shutdown.signal));
  await reservation.release();
  server = await startProcessAndWait({
    command: process.execPath,
    args: [eveCli, 'start', '--host', '127.0.0.1', '--port', String(port), '--no-schedules'],
    cwd: projectRoot,
    env: eveEnvironment,
    stdio: 'inherit',
  }, {
    readyWhen: { url: `${url}/eve/v1/health` },
    timeoutSeconds: 60,
    signal: shutdown.signal,
  });
  process.stdout.write(await runEve([
    'eval', '--strict', '--url', url, '--timeout', '30000',
    '--max-concurrency', '1', '--skip-report', '--verbose',
  ], shutdown.signal));
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
