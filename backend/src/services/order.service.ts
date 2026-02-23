import { calculateTax } from './tax.service';
import { isWithinNYState } from '../utils/geo';
import { parseCsv } from '../utils/csv.parser';
import {
  insertOrder,
  insertOrdersBatch,
  findOrders,
} from '../repositories/order.repository';
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

export async function importOrdersFromCsv(buffer: Buffer): Promise<ImportResult> {
  const rows = await parseCsv(buffer);

  const errors: ImportResult['errors'] = [];
  const validItems: Array<{
    index: number;
    dto: CreateOrderDto;
  }> = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!isWithinNYState(row.latitude, row.longitude)) {
      errors.push({
        row: i + 2,
        reason: `Coordinates (${row.latitude}, ${row.longitude}) are outside New York State`,
      });
    } else {
      validItems.push({ index: i + 2, dto: row });
    }
  }

  const results = await Promise.allSettled(
    validItems.map(({ index, dto }) =>
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
  );

  const toInsert = results
    .map((r) => (r.status === 'fulfilled' ? r.value : null))
    .filter((v): v is NonNullable<typeof v> => v !== null);

  if (toInsert.length > 0) {
    await insertOrdersBatch(toInsert);
  }

  return {
    imported: toInsert.length,
    skipped: errors.length,
    errors,
  };
}

export async function listOrders(query: OrderListQuery): Promise<PaginatedOrders> {
  return findOrders(query);
}
