import { calculateTax, isWithinNY } from './tax.service';
import { randomUUID } from 'crypto';
import { parseCsvStream } from '../utils/csv.parser';
import {
  insertOrder,
  insertOrdersBatch,
  findOrders,
  getOrderStats as getStatsFromRepo,
  updateOrder as updateOrderInRepo,
  deleteOrder as deleteOrderFromRepo,
} from '../repositories/order.repository';
import pLimit from 'p-limit';
import type {
  Order,
  CreateOrderDto,
  OrderListQuery,
  PaginatedOrders,
} from '../models/order';

export async function createOrder(dto: CreateOrderDto): Promise<Order> {
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

const BATCH_SIZE = 500;
const NOMINATIM_CONCURRENCY = 10;

export async function importOrdersFromCsv(filePath: string): Promise<ImportResult> {
  const errors: ImportResult['errors'] = [];
  let imported = 0;

  const limit = pLimit(NOMINATIM_CONCURRENCY);
  let validBatch: Array<{ index: number; dto: CreateOrderDto }> = [];
  const importId = randomUUID();

  const processBatch = async (batch: typeof validBatch) => {
    if (batch.length === 0) return;

    const results = await Promise.allSettled(
      batch.map(({ index, dto }) =>
        limit(() =>
          calculateTax(dto.latitude, dto.longitude, dto.subtotal)
            .then(({ jurisdiction, tax, taxAmount, totalAmount }) => ({
              index, dto, tax, jurisdiction, taxAmount, totalAmount,
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
      try {
        await insertOrdersBatch(toInsert.map(({ dto, tax, jurisdiction, taxAmount, totalAmount }) => ({
          dto, tax, jurisdiction, taxAmount, totalAmount,
        })));
        imported += toInsert.length;
      } catch (err) {
        toInsert.forEach(({ index }) => {
          errors.push({
            row: index,
            reason: `Insert failed: ${err instanceof Error ? err.message : String(err)}`,
          });
        });
      }
    }
  };

  try {
    for await (const row of parseCsvStream(filePath)) {
      if (row.error || !row.dto) {
        errors.push({ row: row.index, reason: row.error ?? 'Invalid row' });
        continue;
      }

      if (!isWithinNY(row.dto.latitude, row.dto.longitude)) {
        errors.push({
          row: row.index,
          reason: `Coordinates (${row.dto.latitude}, ${row.dto.longitude}) are outside New York State.`,
        });
        continue;
      }

      if (row.dto) {
        row.dto.import_id = importId;
      }
      validBatch.push({ index: row.index, dto: row.dto });

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

export async function updateOrder(
  id: number,
  data: Partial<{
    subtotal: number;
    compositeTaxRate: number;
    taxAmount: number;
    totalAmount: number;
    longitude: number;
    latitude: number;
  }>
): Promise<Order | null> {
  return updateOrderInRepo(id, data);
}

export async function deleteOrder(id: number): Promise<boolean> {
  return deleteOrderFromRepo(id);
}

export async function getOrderStats() {
  return getStatsFromRepo();
}
