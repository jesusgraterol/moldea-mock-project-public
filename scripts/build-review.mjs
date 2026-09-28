import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { reviewEquipment, reviewClaims, reviewFulfillment } from '../src/reviews.mjs';
import { buildReplyPreview } from '../src/reply-writer.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidencePaths = [
  'records/hs-214.md',
  'catalog/hc-240.md',
  'records/hs-214-claims.md',
  'policies/parts-warranty.md',
  'records/hs-214-fulfillment.md'
];
const evidence = Object.fromEntries(await Promise.all(evidencePaths.map(async (file) => [
  file,
  await readFile(path.join(root, file), 'utf8')
])));

const reviews = [
  reviewEquipment(evidence['records/hs-214.md'], evidence['catalog/hc-240.md']),
  reviewClaims(evidence['records/hs-214.md'], evidence['records/hs-214-claims.md'], evidence['policies/parts-warranty.md']),
  reviewFulfillment(evidence['records/hs-214-fulfillment.md'])
];
const reply = buildReplyPreview(reviews);
const output = path.join(root, 'dist');
await mkdir(output, { recursive: true });
const packet = {
  caseId: 'HS-214',
  dealer: 'Ridgeway Foodservice',
  customer: 'Goldfinch Market',
  product: 'HC-240 refrigerated display cabinet',
  reviewDate: '27 September 2026',
  reviews,
  reply
};
await writeFile(path.join(output, 'case.json'), JSON.stringify(packet, null, 2) + '\n');

const template = await readFile(path.join(root, 'site/index.html'), 'utf8');
const embeddedData = JSON.stringify(packet).replaceAll('<', '\\u003c');
await writeFile(path.join(output, 'index.html'), template.replace('<!-- CASE_DATA -->', embeddedData));
await copyFile(path.join(root, 'site/styles.css'), path.join(output, 'styles.css'));
await copyFile(path.join(root, 'site/app.js'), path.join(output, 'app.js'));

for (const file of evidencePaths) {
  const target = path.join(output, 'evidence', file);
  await mkdir(path.dirname(target), { recursive: true });
  await copyFile(path.join(root, file), target);
}

console.log('Built HS-214 review and reply preview from checked-in evidence.');
