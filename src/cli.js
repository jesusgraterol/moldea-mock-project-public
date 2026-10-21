import { parseArgs } from 'node:util';
import { loadInputs } from './input.js';
import { planAvailability } from './booking-rules.js';
import { formatReport } from './report.js';

const usage = `Usage: node src/cli.js --rooms <file> --bookings <file> --requests <file>

Read local JSON files and report suitable rooms and rejection reasons.
Paths may be absolute or relative to the current working directory.
Requests are independent suggestions; coordinators approve all bookings.
No input files are written and no reservations are created.

Options:
  --rooms <file>      Fictional room records (required)
  --bookings <file>   Existing booking records (required)
  --requests <file>   Workshop request records (required)
  -h, --help         Show this help

Exit codes: 0 = report or help produced (including no suitable rooms);
            2 = invalid arguments, unreadable files or malformed inputs.`;

async function main() {
  const { values } = parseArgs({
    options: {
      rooms: { type: 'string' },
      bookings: { type: 'string' },
      requests: { type: 'string' },
      help: { type: 'boolean', short: 'h' },
    },
    strict: true,
    allowPositionals: false,
  });
  if (values.help) {
    console.log(usage);
    return;
  }
  for (const kind of ['rooms', 'bookings', 'requests']) {
    if (!values[kind]?.trim()) throw new Error(`--${kind} is required. See --help.`);
  }
  const inputs = await loadInputs(values);
  console.log(formatReport(planAvailability(inputs)));
}

try {
  await main();
} catch (error) {
  console.error(`Cobalt Rooms: ${error.message}`);
  process.exitCode = 2;
}
