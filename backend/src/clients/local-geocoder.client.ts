import path from 'path';
import type { Jurisdiction } from '../models/order';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const geocoder = require('local-reverse-geocoder');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const zipcodes = require('zipcodes');

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

interface GeoAdminCode {
  name: string;
  asciiName: string;
  geoNameId: string;
}

interface GeoResult {
  name: string;
  admin1Code: string | GeoAdminCode;
  admin2Code: string | GeoAdminCode;
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
        const zipInfo = zipcodes.lookupByCoords(lat, lon);
        const postcode = zipInfo?.zip ?? '';

        if (!result) {
          resolve({ city: '', county: '', state: 'New York', postcode });
          return;
        }

        const adminName1 = typeof result.admin1Code === 'object' ? result.admin1Code.name : '';
        const adminName2 = typeof result.admin2Code === 'object' ? result.admin2Code.name : '';

        const NYC_BOROUGHS = new Set(['Richmond County', 'Kings County', 'Queens County', 'Bronx County', 'New York County']);
        const rawCounty = adminName2.trim();
        const county = NYC_BOROUGHS.has(rawCounty) ? 'New York City' : rawCounty;

        resolve({
          city: result.name || '',
          county,
          state: adminName1 || 'New York',
          postcode,
        });
      },
    );
  });
}
