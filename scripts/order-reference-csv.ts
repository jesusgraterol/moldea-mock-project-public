import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { readOrderReferenceCsv } from '../src/order-reference-csv.ts';

const usage = 'Usage: npm run --silent orders:csv -- [--input <orders.json>]\n';

async function main(): Promise<number> {
  let values;
  try {
    ({ values } = parseArgs({
      options: {
        input: { type: 'string' },
        help: { type: 'boolean', short: 'h' },
      },
    }));
    if (values.input !== undefined && values.input.trim() === '') {
      throw new TypeError('--input requires a non-empty file path.');
    }
  } catch (error) {
    process.stderr.write(`orders:csv: ${error instanceof Error ? error.message : 'Invalid arguments.'}\n${usage}`);
    return 2;
  }

  if (values.help) {
    process.stdout.write(usage);
    return 0;
  }

  try {
    // An explicit --input is a native file path relative to the caller's cwd.
    // The default input is anchored to the utility, not the working directory.
    const inputFile = values.input === undefined ? undefined : resolve(values.input);
    process.stdout.write(await readOrderReferenceCsv(inputFile));
    return 0;
  } catch (error) {
    process.stderr.write(`orders:csv: ${error instanceof Error ? error.message : 'Export failed.'}\n`);
    return 1;
  }
}

process.exitCode = await main();
