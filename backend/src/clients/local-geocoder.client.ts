import path from 'path';
import type { Jurisdiction } from '../models/order';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const geocoder = require('local-reverse-geocoder');

const DUMP_DIR =
  process.env.GEOCODER_DUMP_DIR || path.join(process.cwd(), 'geocoder-data');

let initPromise: Promise<void> | null = null;

function init(): Promise<void> {
  if (initPromise) return initPromise;
  initPromise = new Promise<void>((resolve, reject) => {
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
      (err: Error | null) => {
        if (err) reject(err);
        else resolve();
      },
    );
  });
  return initPromise;
}

export async function initGeocoder(): Promise<void> {
  console.log('[Geocoder] Initializing local reverse geocoder...');
  await init();
  console.log('[Geocoder] Ready');
}

interface GeoResult {
  name: string;
  adminName1: string;
  adminName2: string;
}

export async function localReverseGeocode(
  lat: number,
  lon: number,
): Promise<Jurisdiction> {
  await init();

  return new Promise<Jurisdiction>((resolve, reject) => {
    geocoder.lookUp(
      [{ latitude: lat, longitude: lon }],
      1,
      (err: Error | null, results: GeoResult[][]) => {
        if (err) {
          reject(err);
          return;
        }

        const result = results?.[0]?.[0];
        if (!result) {
          resolve({ city: '', county: '', state: 'New York', postcode: '' });
          return;
        }

        // GeoNames повертає "Albany County", але наш CSV має просто "Albany"
        const county = (result.adminName2 || '')
          .replace(/\s+County$/i, '')
          .trim();

        resolve({
          city: result.name || '',
          county,
          state: result.adminName1 || 'New York',
          postcode: '',
        });
      },
    );
  });
}
