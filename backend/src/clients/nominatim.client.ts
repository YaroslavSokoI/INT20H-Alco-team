import axios from 'axios';
import { config } from '../config';
import type { Jurisdiction } from '../models/order';
import { getRedis } from './redis.client';

interface NominatimAddress {
  postcode?: string;
  city?: string;
  town?: string;
  village?: string;
  county?: string;
  state?: string;
}

interface NominatimResponse {
  address: NominatimAddress;
}

export async function reverseGeocode(lat: number, lon: number): Promise<Jurisdiction> {
  const cacheKey = `geocode:${lat}:${lon}`;
  const redis = getRedis();

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached) as Jurisdiction;
    }
  } catch (err) {
    console.error('[Redis] Cache read error for reverseGeocode:', err);
  }

  const response = await axios.get<NominatimResponse>(config.nominatim.baseUrl, {
    params: {
      lat,
      lon,
      format: 'json',
      addressdetails: 1,
    },
    timeout: 10000,
  });

  const addr = response.data.address || {};

  const result: Jurisdiction = {
    postcode: addr.postcode ?? '',
    city: addr.city ?? addr.town ?? addr.village ?? '',
    county: addr.county ?? '',
    state: addr.state ?? '',
  };

  try {
    await redis.setex(cacheKey, 24 * 60 * 60, JSON.stringify(result));
  } catch (err) {
    console.error('[Redis] Cache write error for reverseGeocode:', err);
  }

  return result;
}
