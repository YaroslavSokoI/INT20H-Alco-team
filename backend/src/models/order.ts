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
  jurisdictions: Jurisdiction;
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
  latitude: string;
  longitude: string;
  subtotal: string;
  timestamp: Date;
  composite_tax_rate: string;
  tax_amount: string;
  total_amount: string;
  state_rate: string;
  county_rate: string;
  city_rate: string;
  special_rates: string;
  jurisdictions: Jurisdiction;
  created_at: Date;
}

export interface OrderListQuery {
  page?: number;
  limit?: number;
  state?: string;
  city?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface PaginatedOrders {
  data: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
