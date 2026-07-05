import { cpSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'packages', 'brand-assets');
const targets = [
  join(root, 'frontend', 'public'),
  join(root, 'dashboard', 'public'),
];

const files = ['logo_alshisr.png', 'favicon.ico'];

function syncBrandAssets() {
  if (!existsSync(source)) {
    console.log('[sync-brand-assets] Source not found, skipping:', source);
    return;
  }

  for (const target of targets) {
    mkdirSync(target, { recursive: true });

    for (const file of files) {
      cpSync(join(source, file), join(target, file), { force: true });
    }

    const faviconsSource = join(source, 'favicons');
    const faviconsTarget = join(target, 'favicons');
    mkdirSync(faviconsTarget, { recursive: true });

    for (const entry of readdirSync(faviconsSource)) {
      cpSync(join(faviconsSource, entry), join(faviconsTarget, entry), { force: true });
    }
  }

  console.log('[sync-brand-assets] Synced to frontend/public and dashboard/public');
}

syncBrandAssets();
