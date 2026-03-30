/**
 * Post-build script: emits a dist-ready manifest and copies the service worker.
 */
import { copyFileSync, mkdirSync, existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { createHash } from 'crypto';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const websiteUrl = 'https://www.skywhiterentcar.com/';

const filesToCopy = [
  { from: 'src/background/service-worker.js', to: 'dist/service-worker.js' },
];

const iconDirs = ['dist/icons'];

// Ensure directories
for (const dir of iconDirs) {
  const full = resolve(__dirname, dir);
  if (!existsSync(full)) mkdirSync(full, { recursive: true });
}

// Copy files
for (const { from, to } of filesToCopy) {
  const src = resolve(__dirname, from);
  const dest = resolve(__dirname, to);
  const destDir = dirname(dest);
  if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });
  copyFileSync(src, dest);
  console.log(`  ✓ ${from} → ${to}`);
}

const manifestPath = resolve(__dirname, 'manifest.json');
const distManifestPath = resolve(__dirname, 'dist/manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

manifest.action.default_popup = 'popup.html';
manifest.background.scripts = ['service-worker.js'];
manifest.background.service_worker = 'service-worker.js';

for (const size of ['16', '48', '128']) {
  manifest.action.default_icon[size] = `icons/icon-${size}.png`;
  manifest.icons[size] = `icons/icon-${size}.png`;
}

writeFileSync(distManifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log('  ✓ manifest.json → dist/manifest.json');

const md5OutputPath = resolve(__dirname, 'dist/MD5SUMS.txt');
const distDir = resolve(__dirname, 'dist');
const filesForMd5 = [];

function collectFiles(dir) {
  for (const entry of readdirSync(dir)) {
    const fullPath = resolve(dir, entry);
    if (fullPath === md5OutputPath) continue;

    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      collectFiles(fullPath);
      continue;
    }

    filesForMd5.push(fullPath);
  }
}

collectFiles(distDir);

const md5Lines = [
  `Website: ${websiteUrl}`,
  '',
];

for (const filePath of filesForMd5.sort()) {
  const contents = readFileSync(filePath);
  const hash = createHash('md5').update(contents).digest('hex');
  const relativePath = filePath.replace(`${distDir}\\`, '').replace(/\\/g, '/');
  md5Lines.push(`${hash}  ${relativePath}`);
}

writeFileSync(md5OutputPath, `${md5Lines.join('\n')}\n`, 'utf8');
console.log('  ✓ dist/MD5SUMS.txt');

console.log('\n✅ Post-build complete. Load dist/ as unpacked extension.');
