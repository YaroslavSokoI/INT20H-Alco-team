import { config } from '../../config';

export function isWithinNYState(lat: number, lon: number): boolean {
  const { minLat, maxLat, minLon, maxLon } = config.nyBounds;
  return lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon;
}
