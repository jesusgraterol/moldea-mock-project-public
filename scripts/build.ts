import { createShutdownSignal } from 'jg-process';
import { runEve } from './eve.ts';

const shutdown = createShutdownSignal();
try {
  // No sandbox-facing tools or resources exist in this assistant.
  process.stdout.write(await runEve(['build', '--skip-sandbox-prewarm'], shutdown.signal));
} catch (error) {
  console.error(error);
  process.exitCode = shutdown.exitCode() ?? 1;
} finally {
  shutdown.dispose();
}
