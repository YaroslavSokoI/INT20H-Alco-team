import { calculateTax } from './tax.service';
import { isWithinNYState } from '../utils/geo';
import { parseCsvStream } from '../utils/csv.parser';
import {
  insertOrder,
  insertOrdersBatch,
  findOrders,
} from '../repositories/order.repository';
import pLimit from 'p-limit';
import type {
  Order,
  CreateOrderDto,
  OrderListQuery,
  PaginatedOrders,
} from '../models/order';

export async function createOrder(dto: CreateOrderDto): Promise<Order> {
  if (!isWithinNYState(dto.latitude, dto.longitude)) {
    throw new Error(
      `Coordinates (${dto.latitude}, ${dto.longitude}) are outside New York State`
    );
  }

  const { jurisdiction, tax, taxAmount, totalAmount } = await calculateTax(
    dto.latitude,
    dto.longitude,
    dto.subtotal
  );

  return insertOrder({ dto, tax, jurisdiction, taxAmount, totalAmount });
}

export interface ImportResult {
  imported: number;
  skipped: number;
  errors: Array<{ row: number; reason: string }>;
}

export async function importOrdersFromCsv(filePath: string): Promise<ImportResult> {
  const errors: ImportResult['errors'] = [];
  let imported = 0;
  let skipped = 0;

  const BATCH_SIZE = 100;
  let validBatch: Array<{ index: number; dto: CreateOrderDto }> = [];

  const processBatch = async (batch: typeof validBatch) => {
    if (batch.length === 0) return;

    const limit = pLimit(1);

    const results = await Promise.allSettled(
      batch.map(({ index, dto }) =>
        limit(() =>
          calculateTax(dto.latitude, dto.longitude, dto.subtotal)
            .then(({ jurisdiction, tax, taxAmount, totalAmount }) => ({
              dto, tax, jurisdiction, taxAmount, totalAmount,
            }))
            .catch((err: unknown) => {
              errors.push({
                row: index,
                reason: err instanceof Error ? err.message : String(err),
              });
              return null;
            })
        )
      )
    );

    const toInsert = results
      .map((r) => (r.status === 'fulfilled' ? r.value : null))
      .filter((v): v is NonNullable<typeof v> => v !== null);

    if (toInsert.length > 0) {
      await insertOrdersBatch(toInsert);
      imported += toInsert.length;
    }
  };

  try {
    for await (const row of parseCsvStream(filePath)) {
      if (!isWithinNYState(row.dto.latitude, row.dto.longitude)) {
        errors.push({
          row: row.index,
          reason: `Coordinates (${row.dto.latitude}, ${row.dto.longitude}) are outside New York State`,
        });
        skipped++;
      } else {
        validBatch.push(row);
      }

      if (validBatch.length >= BATCH_SIZE) {
        await processBatch(validBatch);
        validBatch = [];
      }
    }

    if (validBatch.length > 0) {
      await processBatch(validBatch);
    }
  } catch (err) {
    throw new Error(`Streaming failed: ${err instanceof Error ? err.message : String(err)}`);
  }

  return {
    imported,
    skipped: errors.length,
    errors,
  };
}

export async function listOrders(query: OrderListQuery): Promise<PaginatedOrders> {
  return findOrders(query);
}
