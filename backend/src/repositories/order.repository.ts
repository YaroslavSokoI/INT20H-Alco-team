import { db } from './db';
import type {
  Order,
  OrderRow,
  CreateOrderDto,
  TaxBreakdown,
  Jurisdiction,
  OrderListQuery,
  PaginatedOrders,
} from '../models/order';

function rowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    latitude: parseFloat(row.latitude),
    longitude: parseFloat(row.longitude),
    subtotal: parseFloat(row.subtotal),
    timestamp: row.timestamp,
    compositeTaxRate: parseFloat(row.composite_tax_rate),
    taxAmount: parseFloat(row.tax_amount),
    totalAmount: parseFloat(row.total_amount),
    stateRate: parseFloat(row.state_rate),
    countyRate: parseFloat(row.county_rate),
    cityRate: parseFloat(row.city_rate),
    specialRates: parseFloat(row.special_rates),
    jurisdictions: row.jurisdictions,
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
    .returning<OrderRow[]>('*');

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

  const inserted = await db('orders').insert(rows).returning<OrderRow[]>('*');
  return inserted.map(rowToOrder);
}

export async function findOrders(query: OrderListQuery): Promise<PaginatedOrders> {
  const page = query.page ?? 1;
  const limit = Math.min(query.limit ?? 20, 100);
  const offset = (page - 1) * limit;

  let baseQuery = db<OrderRow>('orders');

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

  const [{ count }] = await baseQuery.clone().count<[{ count: string }]>('id as count');
  const total = parseInt(count, 10);

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
