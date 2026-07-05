import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sharedSrc = join(root, 'packages', 'shared', 'src');
const brandAssets = join(root, 'packages', 'brand-assets');
const syncScript = join(root, 'scripts', 'sync-brand-assets.mjs');

if (existsSync(sharedSrc)) {
  console.log('[postinstall] Building @alshisr/shared...');
  execSync('npm run build --workspace=@alshisr/shared', { cwd: root, stdio: 'inherit' });
} else {
  console.log('[postinstall] Skipping @alshisr/shared build (source not present)');
}

if (existsSync(brandAssets) && existsSync(syncScript)) {
  execSync(`node ${syncScript}`, { cwd: root, stdio: 'inherit' });
} else {
  console.log('[postinstall] Skipping brand asset sync (source not present)');
}
