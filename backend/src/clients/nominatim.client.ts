import type { Jurisdiction } from '../models/order';
import { getRedis } from './redis.client';
import { localReverseGeocode } from './local-geocoder.client';

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

  const result = await localReverseGeocode(lat, lon);

  try {
    await redis.setex(cacheKey, 24 * 60 * 60, JSON.stringify(result));
  } catch (err) {
    console.error('[Redis] Cache write error for reverseGeocode:', err);
  }

  return result;
}
