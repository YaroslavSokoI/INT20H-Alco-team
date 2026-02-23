import { parse } from 'csv-parse';
import type { CreateOrderDto } from '../models/order';

export interface CsvRow {
  latitude: string;
  longitude: string;
  subtotal: string;
  timestamp?: string;
}

export function parseCsv(buffer: Buffer): Promise<CreateOrderDto[]> {
  return new Promise((resolve, reject) => {
    parse(
      buffer,
      {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      },
      (err, records: CsvRow[]) => {
        if (err) {
          return reject(new Error(`CSV parse error: ${err.message}`));
        }

        const parsed: CreateOrderDto[] = records.map((row, index) => {
          const lat = parseFloat(row.latitude);
          const lon = parseFloat(row.longitude);
          const subtotal = parseFloat(row.subtotal);

          if (isNaN(lat) || isNaN(lon) || isNaN(subtotal)) {
            throw new Error(
              `Invalid numeric value at row ${index + 2}: lat=${row.latitude}, lon=${row.longitude}, subtotal=${row.subtotal}`
            );
          }

          return {
            latitude: lat,
            longitude: lon,
            subtotal,
            timestamp: row.timestamp || undefined,
          };
        });

        resolve(parsed);
      }
    );
  });
}
