/**
 * Generate extension icons from the official Sky White website thumbnail.
 */
import { mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceIcon = resolve(rootDir, 'src/lib/assets/sky-white-thumbnail.webp');
const iconsDir = resolve(rootDir, 'public', 'icons');

if (!existsSync(iconsDir)) mkdirSync(iconsDir, { recursive: true });
if (!existsSync(sourceIcon)) {
  throw new Error(`Missing source icon: ${sourceIcon}`);
}

for (const size of [16, 48, 128]) {
  const outputPath = resolve(iconsDir, `icon-${size}.png`);
  await sharp(sourceIcon)
    .resize(size, size, {
      fit: 'cover',
      position: 'centre',
    })
    .png()
    .toFile(outputPath);

  console.log(`  ✓ icon-${size}.png`);
}

console.log('\n✅ Official Sky White icons generated in public/icons.');
