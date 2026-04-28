import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const originalsDir = path.join(root, 'public/assets/original');
const worksDir = path.join(root, 'public/assets/works');

// [source relative to project root, slug]
const works = [
  // Original works (already in originals as JPG)
  ['public/assets/original/culture-festival-system.jpg', 'culture-festival-system'],
  ['public/assets/original/motion-sport-poster.jpg', 'motion-sport-poster'],
  ['public/assets/original/nightlife-opening-campaign.jpg', 'nightlife-opening-campaign'],
  ['public/assets/original/rock-day-typographic-poster.jpg', 'rock-day-typographic-poster'],
  ['public/assets/original/pasta-hospitality-poster.jpg', 'pasta-hospitality-poster'],
  ['public/assets/original/burger-campaign-visual.jpg', 'burger-campaign-visual'],
  ['public/assets/original/pizza-offer-design.jpg', 'pizza-offer-design'],
  ['public/assets/original/bar-opening-visual.jpg', 'bar-opening-visual'],
  ['public/assets/original/steak-menu-system.jpg', 'steak-menu-system'],
  ['public/assets/original/vegetarian-menu-architecture.jpg', 'vegetarian-menu-architecture'],
  ['public/assets/original/pet-care-service-flyer.jpg', 'pet-care-service-flyer'],
  ['public/assets/original/coffee-opening-campaign.jpg', 'coffee-opening-campaign'],
  // New works (PNG)
  ['public/assets/original/Ember_Oak_Specialty_Coffee_Poster.png', 'ember-oak-coffee-poster'],
  ['public/assets/original/Ember_Oak_04_Coffee_After_Dark_Poster.png', 'ember-oak-coffee-after-dark'],
  ['public/assets/original/steakhouse-direct-2026-04-26T17-48-01-947Z.png', 'ironwood-steakhouse-campaign'],
  ['public/assets/original/pizza-menu.png', 'classic-pizza-menu'],
  ['public/assets/original/Testing Image Apr 28, 2026 at 08_21_19 PM.png', 'cucina-vera-italian-menu'],
  ['public/assets/original/Testing Image Apr 28, 2026 at 08_20_16 PM.png', 'cucina-vera-chef-campaign'],
  ['public/assets/original/Testing Image Apr 26, 2026 at 06_25_27 PM.png', 'sweet-moments-bakery-poster'],
  ['public/assets/original/Testing Image Apr 27, 2026 at 01_19_24 AM.png', 'fish-chips-menu-system'],
];

const sizes = [480, 720, 1200];

await fs.mkdir(originalsDir, { recursive: true });
await fs.mkdir(worksDir, { recursive: true });

for (const [source, slug] of works) {
  const input = path.join(root, source);

  try {
    await fs.access(input);
  } catch {
    console.warn(`⚠ skipped ${slug}: source not found`);
    continue;
  }

  const metadata = await sharp(input).metadata();
  const maxWidth = metadata.width ?? 1200;
  const targetSizes = sizes.filter((size) => size <= maxWidth);
  if (!targetSizes.includes(maxWidth)) targetSizes.push(maxWidth);

  for (const width of [...new Set(targetSizes)].sort((a, b) => a - b)) {
    const base = path.join(worksDir, `${slug}-${width}`);
    await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(`${base}.webp`);
    await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .avif({ quality: 68, effort: 5 })
      .toFile(`${base}.avif`);
  }

  console.log(`✓ ${slug}: ${metadata.width}x${metadata.height}`);
}
