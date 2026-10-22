import { readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const menusDirectory = resolve(import.meta.dirname, '..', 'menus');

try {
  const entries = await readdir(menusDirectory, { withFileTypes: true });
  const menuFiles = entries
    .filter((entry) => entry.isFile() && /^week-\d+\.json$/.test(entry.name))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right, 'en', { numeric: true }));

  const counts = [];
  for (const filename of menuFiles) {
    try {
      const menu = JSON.parse(await readFile(join(menusDirectory, filename), 'utf8'));
      if (!Array.isArray(menu?.dishes)) throw new Error('expected a dishes array');

      const count = menu.dishes.length;
      counts.push(`${filename}: ${count} ${count === 1 ? 'dish' : 'dishes'}`);
    } catch (error) {
      throw new Error(`${filename}: ${error.message}`);
    }
  }

  console.log(counts.length ? counts.join('\n') : 'No weekly menu files found.');
} catch (error) {
  console.error(`Could not count dishes: ${error.message}`);
  process.exitCode = 1;
}
