export interface TaxBreakdown {
  stateRate: number;
  countyRate: number;
  cityRate: number;
  specialRates: number;
  compositeRate: number;
}

export interface Jurisdiction {
  postcode: string;
  city: string;
  county: string;
  state: string;
}

export interface Order {
  id: number;
  uuid: string;
  latitude: number;
  longitude: number;
  subtotal: number;
  timestamp: Date;
  compositeTaxRate: number;
  taxAmount: number;
  totalAmount: number;
  stateRate: number;
  countyRate: number;
  cityRate: number;
  specialRates: number;
  city: string;
  county: string;
  state: string;
  postcode: string;
  createdAt: Date;
  import_id?: string | null;
}

export interface CreateOrderDto {
  latitude: number;
  longitude: number;
  subtotal: number;
  timestamp?: string;
  import_id?: string | null;
}

export interface OrderRow {
  id: number;
  uuid: string;
  latitude: number;
  longitude: number;
  subtotal: number;
  timestamp: Date;
  composite_tax_rate: number;
  tax_amount: number;
  total_amount: number;
  state_rate: number;
  county_rate: number;
  city_rate: number;
  special_rates: number;
  city: string;
  county: string;
  state: string;
  postcode: string;
  created_at: Date;
  import_id?: string | null;
}

declare module 'knex/types/tables' {
  interface Tables {
    orders: OrderRow;
  }
}

export interface OrderListQuery {
  page?: number;
  limit?: number;
  county?: string;
  city?: string;
  dateFrom?: string;
  dateTo?: string;
  subtotalMin?: number;
  subtotalMax?: number;
  taxRateMin?: number;
  taxRateMax?: number;
  taxMin?: number;
  taxMax?: number;
  totalMin?: number;
  totalMax?: number;
<<<<<<< HEAD
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
=======
  importId?: string;
>>>>>>> 2633061 (feat: track and compare latest CSV import stats)
}

export interface PaginatedOrders {
  data: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
