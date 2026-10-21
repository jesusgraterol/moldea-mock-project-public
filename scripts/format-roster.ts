import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { isMainModule, parseStrictArgs } from 'jg-process';
import { z } from 'zod';

const NonblankStringSchema = z.string().refine((value) => value.trim().length > 0, {
  error: 'Expected a nonblank string.',
});
const RosterSchema = z.array(z.strictObject({
  id: NonblankStringSchema,
  name: NonblankStringSchema,
  shift: NonblankStringSchema,
}));

function csvField(value: string): string {
  return /[",\r\n]/u.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

/** Validate everything before formatting; never mutate entries or assign shifts. */
export function formatRoster(input: unknown): string {
  const parsed = RosterSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(`Invalid roster: expected an array of entries with only nonblank string fields id, name and shift.\n${z.prettifyError(parsed.error)}`);
  }
  // Locale-independent lexical order; equal IDs retain their input order.
  const entries = parsed.data.toSorted((left, right) => left.id < right.id ? -1 : left.id > right.id ? 1 : 0);
  const rows = entries.map(({ id, name, shift }) => [id, name, shift].map(csvField).join(','));
  return ['id,name,shift', ...rows].join('\r\n') + '\r\n';
}

const usage = 'Usage: node scripts/format-roster.ts --input <roster.json>\n'
  + 'Read a fictional roster JSON array and print CSV. Paths are relative to the current directory, or absolute.\n'
  + 'Options: --input <file>  --help\n';

async function main(): Promise<void> {
  let options;
  try {
    options = parseStrictArgs(process.argv.slice(2), {
      input: { type: 'string' },
      help: { type: 'boolean' },
    });
  } catch (error) {
    throw new Error(`${error instanceof Error ? error.message : 'Invalid arguments.'}\n${usage}`);
  }
  if (options.help) {
    process.stdout.write(usage);
    return;
  }
  if (options.input === undefined) throw new Error(`Missing required --input <file>.\n${usage}`);

  const filename = resolve(process.cwd(), options.input);
  let source: string;
  try {
    source = await readFile(filename, 'utf8');
  } catch (error) {
    throw new Error(`Cannot read roster file ${JSON.stringify(filename)}: ${error instanceof Error ? error.message : 'read failed'}`);
  }
  let input: unknown;
  try {
    input = JSON.parse(source);
  } catch {
    throw new Error(`Invalid JSON in roster file ${JSON.stringify(filename)}.`);
  }
  // The first stdout write happens only after the whole input is valid.
  process.stdout.write(formatRoster(input));
}

if (isMainModule(import.meta.url)) {
  try {
    await main();
  } catch (error) {
    console.error(`format-roster: ${error instanceof Error ? error.message : 'Unable to format roster.'}`);
    process.exitCode = 1;
  }
}
