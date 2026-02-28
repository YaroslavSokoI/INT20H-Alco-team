import fs from 'fs';
import type { CreateOrderDto } from '../models/order';

export type JsonParseResult =
  | { index: number; dto: CreateOrderDto; error?: never }
  | { index: number; dto?: never; error: string };

export async function* parseJsonStream(filePath: string): AsyncGenerator<JsonParseResult> {
  let data: unknown;
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    data = JSON.parse(content);
  } catch (err) {
    yield { index: 0, error: `Invalid JSON: ${err instanceof Error ? err.message : String(err)}` };
    return;
  }

  if (!Array.isArray(data)) {
    yield { index: 0, error: 'JSON must be an array of orders' };
    return;
  }

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const index = i + 1;

    if (typeof row !== 'object' || row === null) {
      yield { index, error: 'Each entry must be an object' };
      continue;
    }

    const r = row as Record<string, unknown>;

    const lat = typeof r.latitude === 'number' ? r.latitude : parseFloat(String(r.latitude ?? ''));
    const lon = typeof r.longitude === 'number' ? r.longitude : parseFloat(String(r.longitude ?? ''));
    const subtotal = typeof r.subtotal === 'number' ? r.subtotal : parseFloat(String(r.subtotal ?? ''));

    if (isNaN(lat) || isNaN(lon) || isNaN(subtotal)) {
      yield {
        index,
        error: `Invalid numeric value: lat=${r.latitude}, lon=${r.longitude}, subtotal=${r.subtotal}`,
      };
      continue;
    }

    yield {
      index,
      dto: {
        latitude: lat,
        longitude: lon,
        subtotal,
        timestamp: typeof r.timestamp === 'string' ? r.timestamp : undefined,
      },
    };
  }
}
