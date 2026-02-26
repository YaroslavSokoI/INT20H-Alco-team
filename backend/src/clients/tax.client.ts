import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { getRedis } from './redis.client';
import type { TaxBreakdown, Jurisdiction } from '../models/order';

const TAX_CACHE_TTL_SECONDS = 24 * 60 * 60;
const DATA_DIR = path.join(process.cwd(), 'src/data');

interface CityRow {
  city: string;
  city_rate: string;
}

interface CountyRow {
  county: string;
  base_county_rate: string;
  mctd_rate: string;
}

interface StateRow {
  state: string;
  state_rate: string;
}

function loadCsv<T>(filename: string): T[] {
  const content = fs.readFileSync(path.join(DATA_DIR, filename), 'utf-8');
  return parse(content, { columns: true, skip_empty_lines: true, trim: true }) as T[];
}

const cities = loadCsv<CityRow>('cities.csv');
const counties = loadCsv<CountyRow>('counties.csv');
const states = loadCsv<StateRow>('states.csv');

function findCity(name: string): CityRow | undefined {
  return cities.find(r => r.city.toLowerCase() === name.toLowerCase());
}

function findCounty(name: string): CountyRow | undefined {
  return counties.find(r => r.county.toLowerCase() === name.toLowerCase());
}

function findState(name: string): StateRow | undefined {
  return states.find(r => r.state.toLowerCase() === name.toLowerCase());
}

export async function getTaxRate(jurisdiction: Jurisdiction): Promise<TaxBreakdown> {
  const redis = getRedis();
  const cacheKey = `tax:${jurisdiction.county.toLowerCase()}:${jurisdiction.city.toLowerCase()}`;

  const cached = await redis.get(cacheKey);
  if (cached) {
    await redis.expire(cacheKey, TAX_CACHE_TTL_SECONDS);
    return JSON.parse(cached) as TaxBreakdown;
  }

  const stateRow = findState(jurisdiction.state);
  const stateRate = stateRow ? parseFloat(stateRow.state_rate) : 0;

  const countyRow = findCounty(jurisdiction.county);
  const specialRates = countyRow ? parseFloat(countyRow.mctd_rate) : 0;

  const cityRow = findCity(jurisdiction.city);

  let cityRate: number;
  let countyRate: number;

  if (cityRow) {
    // City found: use city_rate + special_district_rate + state_rate
    cityRate = parseFloat(cityRow.city_rate);
    countyRate = 0;
  } else {
    // City not found: use county_rate + special_district_rate + state_rate
    cityRate = 0;
    countyRate = countyRow ? parseFloat(countyRow.base_county_rate) : 0;
  }

  const result: TaxBreakdown = {
    stateRate: stateRate / 100,
    countyRate: countyRate / 100,
    cityRate: cityRate / 100,
    specialRates: specialRates / 100,
    compositeRate: (stateRate + countyRate + cityRate + specialRates) / 100,
  };

  await redis.set(cacheKey, JSON.stringify(result), 'EX', TAX_CACHE_TTL_SECONDS);
  return result;
}
