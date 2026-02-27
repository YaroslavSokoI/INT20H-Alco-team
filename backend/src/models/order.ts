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
}

export interface CreateOrderDto {
  latitude: number;
  longitude: number;
  subtotal: number;
  timestamp?: string;
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
  search?: string;
}

export interface PaginatedOrders {
  data: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
