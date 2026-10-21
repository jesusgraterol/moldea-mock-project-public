import { text as readText } from 'node:stream/consumers';
import { parseArgs } from 'node:util';

export function countLabelWords(labelText) {
  return labelText.match(/\S+/gu)?.length ?? 0;
}

export function checkLabelLength(labelText) {
  const wordCount = countLabelWords(labelText);
  const limit = 40;
  const reason = wordCount === 0 ? 'empty-label' : wordCount > limit ? 'over-limit' : null;

  return {
    schemaVersion: 1,
    wordCount,
    limit,
    length: reason === null ? 'PASS' : 'FAIL',
    reason,
  };
}

async function main() {
  const { values } = parseArgs({
    options: {
      text: { type: 'string' },
      help: { type: 'boolean' },
    },
  });

  if (values.help) {
    process.stdout.write(
      'Usage: node count-label-words.mjs [--text "exact label text"]\n'
      + 'Without --text, read label text only from standard input.\n'
      + 'Exit codes: 0 length passes; 1 empty/over limit; 2 usage or input error.\n',
    );
    return;
  }

  if (values.text === undefined && process.stdin.isTTY) {
    throw new Error('Pass --text or send the exact label on standard input.');
  }

  const labelText = values.text ?? await readText(process.stdin);
  const result = checkLabelLength(labelText);
  process.stdout.write(`${JSON.stringify(result)}\n`);
  process.exitCode = result.length === 'PASS' ? 0 : 1;
}

if (import.meta.main) {
  try {
    await main();
  } catch (error) {
    process.stderr.write(`Word count not checked: ${error.message}\n`);
    process.exitCode = 2;
  }
}
