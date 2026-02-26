import apiClient from './client';
import type { OrderRow } from '@/types/order';

export interface PaginatedOrders {
  orders: OrderRow[];
  total: number;
}

export const ordersApi = {
  getOrders: async (page: number, limit: number) => {
    const response = await apiClient.get<PaginatedOrders>(`/orders`, {
      params: { page, limit },
    });
    return response.data;
  },

  createOrder: async (orderData: Omit<OrderRow, 'id'>) => {
    const response = await apiClient.post<OrderRow>('/orders', orderData);
    return response.data;
  },
};
