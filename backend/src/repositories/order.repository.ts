import { db } from './db';
import type {
  Order,
  CreateOrderDto,
  TaxBreakdown,
  Jurisdiction,
  OrderListQuery,
  PaginatedOrders,
  OrderRow,
} from '../models/order';

function rowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    uuid: row.uuid,
    latitude: typeof row.latitude === 'string' ? parseFloat(row.latitude) : row.latitude,
    longitude: typeof row.longitude === 'string' ? parseFloat(row.longitude) : row.longitude,
    subtotal: typeof row.subtotal === 'string' ? parseFloat(row.subtotal) : row.subtotal,
    timestamp: row.timestamp,
    compositeTaxRate: typeof row.composite_tax_rate === 'string' ? parseFloat(row.composite_tax_rate) : row.composite_tax_rate,
    taxAmount: typeof row.tax_amount === 'string' ? parseFloat(row.tax_amount) : row.tax_amount,
    totalAmount: typeof row.total_amount === 'string' ? parseFloat(row.total_amount) : row.total_amount,
    stateRate: typeof row.state_rate === 'string' ? parseFloat(row.state_rate) : row.state_rate,
    countyRate: typeof row.county_rate === 'string' ? parseFloat(row.county_rate) : row.county_rate,
    cityRate: typeof row.city_rate === 'string' ? parseFloat(row.city_rate) : row.city_rate,
    specialRates: typeof row.special_rates === 'string' ? parseFloat(row.special_rates) : row.special_rates,
    jurisdictions: typeof row.jurisdictions === 'string' ? JSON.parse(row.jurisdictions) : row.jurisdictions,
    createdAt: row.created_at,
  };
}

export interface InsertOrderData {
  dto: CreateOrderDto;
  tax: TaxBreakdown;
  jurisdiction: Jurisdiction;
  taxAmount: number;
  totalAmount: number;
}

export async function insertOrder(data: InsertOrderData): Promise<Order> {
  const { dto, tax, jurisdiction, taxAmount, totalAmount } = data;

  const [row] = await db('orders')
    .insert({
      latitude: dto.latitude,
      longitude: dto.longitude,
      subtotal: dto.subtotal,
      timestamp: dto.timestamp ? new Date(dto.timestamp) : new Date(),
      composite_tax_rate: tax.compositeRate,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      state_rate: tax.stateRate,
      county_rate: tax.countyRate,
      city_rate: tax.cityRate,
      special_rates: tax.specialRates,
      jurisdictions: JSON.stringify(jurisdiction),
    })
    .returning('*');

  return rowToOrder(row);
}

export async function insertOrdersBatch(items: InsertOrderData[]): Promise<Order[]> {
  if (items.length === 0) return [];

  const rows = items.map(({ dto, tax, jurisdiction, taxAmount, totalAmount }) => ({
    latitude: dto.latitude,
    longitude: dto.longitude,
    subtotal: dto.subtotal,
    timestamp: dto.timestamp ? new Date(dto.timestamp) : new Date(),
    composite_tax_rate: tax.compositeRate,
    tax_amount: taxAmount,
    total_amount: totalAmount,
    state_rate: tax.stateRate,
    county_rate: tax.countyRate,
    city_rate: tax.cityRate,
    special_rates: tax.specialRates,
    jurisdictions: JSON.stringify(jurisdiction),
  }));

  const inserted = await db('orders').insert(rows).returning('*');
  return inserted.map(rowToOrder);
}

export async function findOrders(query: OrderListQuery): Promise<PaginatedOrders> {
  const page = query.page ?? 1;
  const limit = Math.min(query.limit ?? 20, 100);
  const offset = (page - 1) * limit;

  let baseQuery = db('orders');

  if (query.state) {
    baseQuery = baseQuery.whereRaw(`jurisdictions->>'state' = ?`, [query.state]);
  }
  if (query.city) {
    baseQuery = baseQuery.whereRaw(`jurisdictions->>'city' = ?`, [query.city]);
  }
  if (query.dateFrom) {
    baseQuery = baseQuery.where('timestamp', '>=', new Date(query.dateFrom));
  }
  if (query.dateTo) {
    baseQuery = baseQuery.where('timestamp', '<=', new Date(query.dateTo));
  }

  const countResult = await baseQuery.clone().count('id as count');
  const countObj = countResult[0] as unknown as { count: string | number };
  const count = countObj?.count || 0;
  const total = typeof count === 'string' ? parseInt(count, 10) : Number(count);

  const rows = await baseQuery
    .clone()
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset);

  return {
    data: rows.map(rowToOrder),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getOrderStats(): Promise<{ 
  totalOrders: number; 
  totalSales: number; 
  totalTax: number; 
}> {
  // Knex aggregate return types are driver-dependent (often strings), and the
  // typings can be too generic. Normalize everything to numbers.
  type RawStatsRow = {
    totalOrders: string | number | null;
    totalSales: string | number | null;
    totalTax: string | number | null;
  };

  const [stats] = (await db('orders')
    .sum('total_amount as totalSales')
    .sum('tax_amount as totalTax')
    .count('id as totalOrders')) as unknown as RawStatsRow[];

  return {
    totalOrders: Number(stats.totalOrders || 0),
    totalSales: Number(stats.totalSales || 0),
    totalTax: Number(stats.totalTax || 0),
  };
}
