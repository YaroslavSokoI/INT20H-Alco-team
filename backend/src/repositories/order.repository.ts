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
import { parseSearch } from '../utils/search.parser';

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
    city: row.city,
    county: row.county,
    state: row.state,
    postcode: row.postcode,
    createdAt: row.created_at,
    import_id: row.import_id,
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
      city: jurisdiction.city,
      county: jurisdiction.county,
      state: jurisdiction.state,
      postcode: jurisdiction.postcode,
      import_id: dto.import_id,
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
    city: jurisdiction.city,
    county: jurisdiction.county,
    state: jurisdiction.state,
    postcode: jurisdiction.postcode,
    import_id: dto.import_id,
  }));

  const inserted = await db('orders').insert(rows).returning('*');
  return inserted.map(rowToOrder);
}

export async function findOrders(query: OrderListQuery): Promise<PaginatedOrders> {
  const page = query.page ?? 1;
  const limit = query.limit ? Math.min(query.limit, 1000000) : 20;
  const offset = (page - 1) * limit;

  let baseQuery = db('orders');

  if (query.county) {
    baseQuery = baseQuery.where('county', query.county);
  }
  if (query.city) {
    baseQuery = baseQuery.where('city', query.city);
  }
  if (query.dateFrom) {
    baseQuery = baseQuery.where('timestamp', '>=', new Date(query.dateFrom));
  }
  if (query.dateTo) {
    baseQuery = baseQuery.where('timestamp', '<=', new Date(query.dateTo));
  }
  if (query.subtotalMin !== undefined) {
    baseQuery = baseQuery.where('subtotal', '>=', query.subtotalMin);
  }
  if (query.subtotalMax !== undefined) {
    baseQuery = baseQuery.where('subtotal', '<=', query.subtotalMax);
  }
  if (query.taxRateMin !== undefined) {
    baseQuery = baseQuery.where('composite_tax_rate', '>=', query.taxRateMin);
  }
  if (query.taxRateMax !== undefined) {
    baseQuery = baseQuery.where('composite_tax_rate', '<=', query.taxRateMax);
  }
  if (query.taxMin !== undefined) {
    baseQuery = baseQuery.where('tax_amount', '>=', query.taxMin);
  }
  if (query.taxMax !== undefined) {
    baseQuery = baseQuery.where('tax_amount', '<=', query.taxMax);
  }
  if (query.totalMin !== undefined) {
    baseQuery = baseQuery.where('total_amount', '>=', query.totalMin);
  }
  if (query.totalMax !== undefined) {
    baseQuery = baseQuery.where('total_amount', '<=', query.totalMax);
  }

  if (query.search) {
    const { defaultTerms, structured } = parseSearch(query.search);
    const DEFAULT_FIELDS = [
      `CAST(id AS TEXT)`,
      `uuid::text`,
      `city`,
      `county`,
      `state`,
      `postcode`,
      `CAST(timestamp AS TEXT)`,
    ];

    for (const term of defaultTerms) {
      baseQuery = baseQuery.where(function () {
        DEFAULT_FIELDS.forEach(f => this.orWhereRaw(`${f} ILIKE ?`, [`%${term}%`]));
      });
    }

    for (const { field, term, exact } of structured) {
      if (exact) {
        baseQuery = baseQuery.whereRaw(`${field} = ?`, [term]);
      } else {
        baseQuery = baseQuery.whereRaw(`${field} ILIKE ?`, [`%${term}%`]);
      }
    }
  }

  if (query.importId) {
    if (query.importId === 'latest') {
      const latestImport = await db('orders')
        .select('import_id')
        .whereNotNull('import_id')
        .groupBy('import_id')
        .orderBy('max_created_at', 'desc')
        .max('created_at as max_created_at')
        .limit(1)
        .first() as unknown as { import_id: string } | undefined;

      if (latestImport?.import_id) {
        baseQuery = baseQuery.where('import_id', latestImport.import_id);
      } else {
        // If there are no imports with an ID, force an empty result or handle gracefully
        baseQuery = baseQuery.whereRaw('1 = 0');
      }
    } else {
      baseQuery = baseQuery.where('import_id', query.importId);
    }
  }

  const countResult = await baseQuery.clone().count('id as count');
  const countObj = countResult[0] as unknown as { count: string | number };
  const count = countObj?.count || 0;
  const total = typeof count === 'string' ? parseInt(count, 10) : Number(count);

  const SORTABLE: Record<string, string> = {
    id: 'id',
    timestamp: 'timestamp',
    subtotal: 'subtotal',
    compositeTaxRate: 'composite_tax_rate',
    stateRate: 'state_rate',
    countyRate: 'county_rate',
    cityRate: 'city_rate',
    specialRates: 'special_rates',
    specialDistrict: 'special_rates',
    taxAmount: 'tax_amount',
    totalAmount: 'total_amount',
    state: 'state',
    city: 'city',
    county: 'county',
    postcode: 'postcode',
    latitude: 'latitude',
    longitude: 'longitude',
    jurisdictionSummary: 'city',
  };
  const sortCol = (query.sortBy && SORTABLE[query.sortBy]) ?? 'created_at';
  const sortDir = query.sortOrder === 'asc' ? 'asc' : 'desc';

  const rows = await baseQuery
    .clone()
    .orderBy(sortCol, sortDir)
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
  const updateData: Record<string, number> = {};
  if (data.subtotal !== undefined) updateData.subtotal = data.subtotal;
  if (data.compositeTaxRate !== undefined) updateData.composite_tax_rate = data.compositeTaxRate;
  if (data.taxAmount !== undefined) updateData.tax_amount = data.taxAmount;
  if (data.totalAmount !== undefined) updateData.total_amount = data.totalAmount;
  if (data.longitude !== undefined) updateData.longitude = data.longitude;
  if (data.latitude !== undefined) updateData.latitude = data.latitude;

  const [row] = await db('orders').where({ id }).update(updateData).returning('*');
  if (!row) return null;
  return rowToOrder(row);
}

export async function deleteOrder(id: number): Promise<boolean> {
  const count = await db('orders').where({ id }).delete();
  return Number(count) > 0;
}

export async function getOrderStats(): Promise<{
  totalOrders: number;
  totalSales: number;
  totalTax: number;
  totalImports: number;
  deltaOrders: number;
  deltaSales: number;
  deltaTax: number;
  deltaImports: number;
}> {
  type RawStatsRow = {
    totalOrders: string | number | null;
    totalSales: string | number | null;
    totalTax: string | number | null;
    totalImports: string | number | null;
  };

  const [allStats] = await db('orders')
    .sum('total_amount as totalSales')
    .sum('tax_amount as totalTax')
    .count('id as totalOrders')
    .countDistinct('import_id as totalImports') as unknown as RawStatsRow[];

  const recentImports = await db('orders')
    .select('import_id')
    .max('created_at as max_created_at')
    .whereNotNull('import_id')
    .groupBy('import_id')
    .orderBy('max_created_at', 'desc')
    .limit(2) as unknown as { import_id: string }[];

  let current: RawStatsRow = { totalOrders: 0, totalSales: 0, totalTax: 0, totalImports: 0 };
  let previous: RawStatsRow = { totalOrders: 0, totalSales: 0, totalTax: 0, totalImports: 0 };

  if (recentImports.length > 0) {
    const latestId = recentImports[0].import_id;
    const [latestStats] = await db('orders')
      .where('import_id', latestId)
      .sum('total_amount as totalSales')
      .sum('tax_amount as totalTax')
      .count('id as totalOrders')
      .countDistinct('import_id as totalImports') as unknown as RawStatsRow[];
    current = latestStats;
  }

  if (recentImports.length > 1) {
    const prevId = recentImports[1].import_id;
    const [prevStats] = await db('orders')
      .where('import_id', prevId)
      .sum('total_amount as totalSales')
      .sum('tax_amount as totalTax')
      .count('id as totalOrders')
      .countDistinct('import_id as totalImports') as unknown as RawStatsRow[];
    previous = prevStats;
  }

  const delta = (curr: number, prev: number): number => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return Math.round(((curr - prev) / prev) * 1000) / 10;
  };

  const currOrders = Number(current.totalOrders || 0);
  const prevOrders = Number(previous.totalOrders || 0);
  const currSales = Number(current.totalSales || 0);
  const prevSales = Number(previous.totalSales || 0);
  const currTax = Number(current.totalTax || 0);
  const prevTax = Number(previous.totalTax || 0);

  // For imports delta, we only have 1 import per run usually, but we calculate based on distinct count
  const currImports = Number(current.totalImports || 0);
  const prevImports = Number(previous.totalImports || 0);

  return {
    totalOrders: Number(allStats.totalOrders || 0),
    totalSales: Number(allStats.totalSales || 0),
    totalTax: Number(allStats.totalTax || 0),
    totalImports: Number(allStats.totalImports || 0),
    deltaOrders: delta(currOrders, prevOrders),
    deltaSales: delta(currSales, prevSales),
    deltaTax: delta(currTax, prevTax),
    deltaImports: delta(currImports, prevImports),
  };
}
