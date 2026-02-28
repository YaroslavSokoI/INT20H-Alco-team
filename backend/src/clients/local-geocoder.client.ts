import path from 'path';
import fs from 'fs';
import type { Jurisdiction } from '../models/order';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const geocoder = require('local-reverse-geocoder');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const zipcodes = require('zipcodes');

const NY_CITIES: Set<string> = new Set(
  fs.readFileSync(path.join(process.cwd(), 'src/data/cities.csv'), 'utf-8')
    .split('\n')
    .slice(1)
    .map((line) => line.split(',')[0].trim())
    .filter(Boolean)
);

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
  countryCode: string;
  latitude: string;
  longitude: string;
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
      10,
      (err: Error | null, results: GeoResult[][]) => {
        if (err) {
          reject(err);
          return;
        }

        const result = results?.[0]?.find((r) => {
          const stateName = typeof r.admin1Code === 'object' ? r.admin1Code.name : '';
          return stateName === 'New York';
        });

        const coordsZip = zipcodes.lookupByCoords(lat, lon);
        const coordsPostcode = coordsZip?.country === 'US' && coordsZip?.state === 'NY' ? (coordsZip.zip ?? '') : '';

        const cityName = result?.name ?? '';
        const cityZip = cityName ? zipcodes.lookupByName(cityName, 'NY')?.[0]?.zip ?? '' : '';

        const cityLat = result ? parseFloat(result.latitude) : null;
        const cityLon = result ? parseFloat(result.longitude) : null;
        const geoZip = cityLat && cityLon ? zipcodes.lookupByCoords(cityLat, cityLon) : null;
        const geoPostcode = geoZip?.country === 'US' && geoZip?.state === 'NY' ? (geoZip.zip ?? '') : '';

        const postcode = coordsPostcode || cityZip || geoPostcode;

        if (!result) {
          resolve({ city: '', county: '', state: 'New York', postcode });
          return;
        }

        const adminName2 = typeof result.admin2Code === 'object' ? result.admin2Code.name : '';

        const NYC_BOROUGHS = new Set(['Richmond County', 'Kings County', 'Queens County', 'Bronx County', 'New York County']);
        const rawCounty = adminName2.trim();
        const county = NYC_BOROUGHS.has(rawCounty) ? 'New York City' : rawCounty;

        const city = county === 'New York City'
          ? 'New York City'
          : NY_CITIES.has(result.name) ? result.name : '';

        resolve({
          city,
          county,
          state: 'New York',
          postcode,
        });
      },
    );
  });
}
