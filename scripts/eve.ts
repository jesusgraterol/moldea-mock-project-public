import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runProcess } from 'jg-process';

export const projectRoot = resolve(import.meta.dirname, '..');
export const eveCli = resolve(dirname(fileURLToPath(import.meta.resolve('eve/package.json'))), 'bin/eve.js');
export const eveEnvironment = { ...process.env, EVE_TELEMETRY_DISABLED: '1' };

/** Execute the inspected, installed Eve CLI, never a transient package or shell. */
export async function runEve(
  args: string[],
  signal: AbortSignal,
  environment: NodeJS.ProcessEnv = eveEnvironment,
): Promise<string> {
  const result = await runProcess({
    command: process.execPath,
    args: [eveCli, ...args],
    cwd: projectRoot,
    env: environment,
    signal,
    timeoutSeconds: 120,
    maxOutputBytes: 2 * 1_024 * 1_024,
  });
  signal.throwIfAborted();
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.exitCode !== 0 || result.signalCode !== null) {
    throw new Error(`eve ${args[0]} failed (exit ${result.exitCode}, signal ${result.signalCode}).\n${result.stdout}`);
  }
  return result.stdout;
}
