import apiClient from './client';

export interface ApiOrder {
  id: number;
  uuid: string;
  latitude: number;
  longitude: number;
  subtotal: number;
  timestamp: string;
  compositeTaxRate: number;
  taxAmount: number;
  totalAmount: number;
  stateRate: number;
  countyRate: number;
  cityRate: number;
  specialRates: number;
  jurisdictions: {
    postcode: string;
    city: string;
    county: string;
    state: string;
  } | string;
  createdAt: string;
}

export interface PaginatedOrders {
  data: ApiOrder[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrderFilters {
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
}

export interface OrderStats {
  totalOrders: number;
  totalSales: number;
  totalTax: number;
}

export const ordersApi = {
  getOrders: async (page: number, limit: number, filters?: OrderFilters) => {
    const response = await apiClient.get<PaginatedOrders>(`/orders`, {
      params: { page, limit, ...filters },
    });
    return response.data;
  },

  getStats: async () => {
    const response = await apiClient.get<OrderStats>('/orders/stats');
    return response.data;
  },

  createOrder: async (orderData: { latitude: number; longitude: number; subtotal: number; timestamp?: string }) => {
    const response = await apiClient.post<ApiOrder>('/orders', orderData);
    return response.data;
  },

  importOrders: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/orders/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
