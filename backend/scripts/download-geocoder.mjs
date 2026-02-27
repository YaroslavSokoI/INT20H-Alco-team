/**
 * Заздалегідь скачує GeoNames дані для local-reverse-geocoder.
 * Запусти один раз: npm run geocoder:download
 * Дані збережуться в backend/geocoder-data/ і будуть скопійовані в Docker image.
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DUMP_DIR = path.join(__dirname, '..', 'geocoder-data');
const geocoder = require('local-reverse-geocoder');

console.log(`[Geocoder] Downloading GeoNames data to: ${DUMP_DIR}`);
console.log('[Geocoder] This may take 1-2 minutes (~40MB)...');

geocoder.init(
  {
    load: {
      admin1: true,
      admin2: true,
      admin3And4: false,
      alternateNames: false,
    },
    dumpDirectory: DUMP_DIR,
  },
  (err) => {
    if (err) {
      console.error('[Geocoder] Download failed:', err);
      process.exit(1);
    }
    console.log('[Geocoder] Done! Data saved to backend/geocoder-data/');
    process.exit(0);
  },
);
