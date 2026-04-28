import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const originalsDir = path.join(root, 'public/assets/original');
const worksDir = path.join(root, 'public/assets/works');

const works = [
  ['3131777339533_.pic_hd.jpg', 'culture-festival-system'],
  ['3141777339534_.pic_hd.jpg', 'motion-sport-poster'],
  ['3161777339536_.pic_hd.jpg', 'nightlife-opening-campaign'],
  ['3181777339538_.pic_hd.jpg', 'rock-day-typographic-poster'],
  ['3241777339544_.pic_hd.jpg', 'pasta-hospitality-poster'],
  ['3251777339545_.pic_hd.jpg', 'burger-campaign-visual'],
  ['3281777339549_.pic_hd.jpg', 'pizza-offer-design'],
  ['3311777339551_.pic_hd.jpg', 'bar-opening-visual'],
  ['3331777339553_.pic_hd.jpg', 'steak-menu-system'],
  ['3171777339537_.pic_hd.jpg', 'vegetarian-menu-architecture'],
  ['3191777339539_.pic_hd.jpg', 'pet-care-service-flyer'],
  ['3321777339552_.pic_hd.jpg', 'coffee-opening-campaign'],
];

const sizes = [480, 720, 1200];

await fs.mkdir(originalsDir, { recursive: true });
await fs.mkdir(worksDir, { recursive: true });

for (const [source, slug] of works) {
  const input = path.join(root, source);
  const originalTarget = path.join(originalsDir, `${slug}.jpg`);
  await fs.copyFile(input, originalTarget);

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

  console.log(`${slug}: ${metadata.width}x${metadata.height}`);
}
