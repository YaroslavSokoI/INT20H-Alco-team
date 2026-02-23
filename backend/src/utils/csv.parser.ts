import { parse } from 'csv-parse';
import type { CreateOrderDto } from '../models/order';

export interface CsvRow {
  latitude: string;
  longitude: string;
  subtotal: string;
  timestamp?: string;
}

import fs from 'fs';

export async function* parseCsvStream(filePath: string): AsyncGenerator<{ index: number; dto: CreateOrderDto }> {
  let recordIndex = 0;

  const parser = fs.createReadStream(filePath).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })
  );

  for await (const row of parser as AsyncIterable<CsvRow>) {
    const lat = parseFloat(row.latitude);
    const lon = parseFloat(row.longitude);
    const subtotal = parseFloat(row.subtotal);

    if (isNaN(lat) || isNaN(lon) || isNaN(subtotal)) {
      throw new Error(
        `Invalid numeric value at row ${recordIndex + 2}: lat=${row.latitude}, lon=${row.longitude}, subtotal=${row.subtotal}`
      );
    }

    yield {
      index: recordIndex + 2,
      dto: {
        latitude: lat,
        longitude: lon,
        subtotal,
        timestamp: row.timestamp || undefined,
      },
    };

    recordIndex++;
  }
}
