import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));
const tracked = execFileSync('git', ['ls-files', '-z', '--', 'records/*.md'], {
  cwd: repositoryRoot,
  encoding: 'utf8',
});

for (const path of tracked.split('\0').filter(Boolean).sort()) {
  const heading = /^# (CS-\d+): (.+)$/m.exec(
    readFileSync(resolve(repositoryRoot, path), 'utf8'),
  );
  if (!heading) throw new Error(`Missing ID and title heading in ${path}`);
  console.log(`${heading[1]}\t${heading[2]}`);
}
