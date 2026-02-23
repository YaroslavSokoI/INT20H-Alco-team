import axios from 'axios';
import { config } from '../../config';
import { getRedis } from './redis.client';
import type { TaxBreakdown } from '../models/order';

interface TaxJarRateResponse {
  rate: {
    zip: string;
    state: string;
    state_rate: string;
    county: string;
    county_rate: string;
    city: string;
    city_rate: string;
    combined_district_rate: string;
    combined_rate: string;
    freight_taxable: boolean;
  };
}

const TAX_CACHE_TTL_SECONDS = 24 * 60 * 60;

function cacheKey(zip: string): string {
  return `tax:zip:${zip}`;
}

export async function getTaxRateByZip(zip: string): Promise<TaxBreakdown> {
  const redis = getRedis();
  const key = cacheKey(zip);

  const cached = await redis.get(key);
  if (cached) {
    await redis.expire(key, TAX_CACHE_TTL_SECONDS);
    return JSON.parse(cached) as TaxBreakdown;
  }

  const response = await axios.get<TaxJarRateResponse>(
    `${config.taxApi.baseUrl}/v2/rates/${zip}`,
    {
      headers: { Authorization: `Bearer ${config.taxApi.apiKey}` },
      timeout: 10000,
    }
  );

  const r = response.data.rate;

  const breakdown: TaxBreakdown = {
    stateRate: parseFloat(r.state_rate) || 0,
    countyRate: parseFloat(r.county_rate) || 0,
    cityRate: parseFloat(r.city_rate) || 0,
    specialRates: parseFloat(r.combined_district_rate) || 0,
    compositeRate: parseFloat(r.combined_rate) || 0,
  };

  await redis.set(key, JSON.stringify(breakdown), 'EX', TAX_CACHE_TTL_SECONDS);
  return breakdown;
}
