import { existsSync, readdirSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const worksSource = await readFile(path.join(root, 'src/data/works.ts'), 'utf8');
const objectMatches = [...worksSource.matchAll(/\{\s*id:\s*'([^']+)'[\s\S]*?slug:\s*'([^']+)'[\s\S]*?sourceFile:\s*'([^']+)'[\s\S]*?width:\s*(\d+)[\s\S]*?height:\s*(\d+)[\s\S]*?alt:\s*'([^']+)'/g)];
const optimizedFiles = new Set(readdirSync(path.join(root, 'public/assets/works')));
const errors = [];
const seenSlugs = new Set();
if (objectMatches.length === 0) errors.push('No work entries found in src/data/works.ts.');
for (const match of objectMatches) {
  const [, id, slug, sourceFile, widthRaw, heightRaw, alt] = match;
  const width = Number(widthRaw);
  const height = Number(heightRaw);
  if (seenSlugs.has(slug)) errors.push(`${id}: duplicate slug ${slug}.`);
  seenSlugs.add(slug);
  if (!alt || alt.length < 18) errors.push(`${id}: alt text is too short.`);
  if (!Number.isFinite(width) || width <= 0) errors.push(`${id}: invalid width.`);
  if (!Number.isFinite(height) || height <= 0) errors.push(`${id}: invalid height.`);
  if (!existsSync(path.join(root, 'public/assets/original', sourceFile))) errors.push(`${id}: missing original asset ${sourceFile}.`);
  const hasWebp = [...optimizedFiles].some((file) => file.startsWith(`${slug}-`) && file.endsWith('.webp'));
  const hasAvif = [...optimizedFiles].some((file) => file.startsWith(`${slug}-`) && file.endsWith('.avif'));
  if (!hasWebp) errors.push(`${id}: missing optimized WebP asset for ${slug}.`);
  if (!hasAvif) errors.push(`${id}: missing optimized AVIF asset for ${slug}.`);
}
if (errors.length) {
  console.error(`Work validation failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Validated ${objectMatches.length} work entries and optimized asset sets.`);
