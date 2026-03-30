import { existsSync, readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const targetPath = resolve(rootDir, 'node_modules', 'hasown', 'tsconfig.json');

if (!existsSync(targetPath)) {
  console.log('  • node_modules/hasown/tsconfig.json not found, skipping Firefox JSON fix');
  process.exit(0);
}

const original = readFileSync(targetPath, 'utf8');
const normalized = original
  .replace(/,\s*\]/g, '\n  ]')
  .replace(/,\s*\}/g, '\n}');

if (normalized !== original) {
  writeFileSync(targetPath, normalized, 'utf8');
  console.log('  ✓ Fixed node_modules/hasown/tsconfig.json for Firefox strict JSON parsing');
} else {
  console.log('  • Firefox JSON fix already applied');
}