import { createReadStream } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';

const recordsDirectory = fileURLToPath(new URL('../../records/', import.meta.url));
const headingPattern = /^# ([A-Z]+-\d+): (.+)$/;

/** Reads a record's first-line heading without loading the rest of its fact sheet. */
const readRecordHeading = async (filename) => {
  const stream = createReadStream(join(recordsDirectory, filename), { encoding: 'utf8' });
  const lines = createInterface({ input: stream, crlfDelay: Infinity });

  try {
    for await (const line of lines) {
      const heading = headingPattern.exec(line);
      if (!heading || !heading[2].trim()) {
        throw new Error(`records/${filename}: missing or malformed first-line "# ID: Title" heading`);
      }

      return { id: heading[1], title: heading[2].trim() };
    }

    throw new Error(`records/${filename}: missing first-line "# ID: Title" heading`);
  } finally {
    lines.close();
    stream.destroy();
  }
};

const listRecords = async () => {
  const entries = await readdir(recordsDirectory, { withFileTypes: true });
  const records = [];

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.md')) {
      records.push(await readRecordHeading(entry.name));
    }
  }

  records.sort((left, right) => left.id.localeCompare(right.id, 'en', { numeric: true }));
  process.stdout.write(
    records.length > 0
      ? `${records.map(({ id, title }) => `${id}\t${title}`).join('\n')}\n`
      : 'No Markdown records found in records/.\n',
  );
};

try {
  await listRecords();
} catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  process.stderr.write(`Could not list records: ${message}\n`);
  process.exitCode = 1;
}
