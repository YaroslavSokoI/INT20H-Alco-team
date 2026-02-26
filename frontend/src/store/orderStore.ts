import { create } from "zustand";
import type { OrderRow } from "@/types/order";
import { ordersApi, type ApiOrder, type OrderFilters, type OrderStats } from "@/api/orders";

function mapApiOrder(order: ApiOrder): OrderRow {
    const jurisdictions = typeof order.jurisdictions === "string"
        ? JSON.parse(order.jurisdictions)
        : order.jurisdictions;
    return { ...order, jurisdictions };
}

interface OrderState {
    orders: OrderRow[];
    isLoading: boolean;
    currentPage: number;
    pageSize: number;
    totalOrders: number;
    stats: OrderStats;
    searchQuery: string;
    filters: OrderFilters;
    fetchOrders: (page?: number) => Promise<void>;
    setCurrentPage: (page: number) => void;
    setSearchQuery: (query: string) => void;
    setFilters: (filters: OrderFilters) => void;
    addOrder: (order: Omit<OrderRow, "id">) => Promise<void>;
    updateOrder: (id: string, order: Partial<OrderRow>) => Promise<void>;
    deleteOrder: (id: string) => Promise<void>;
    importOrders: (file: File) => Promise<unknown>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
    orders: [],
    isLoading: false,
    currentPage: 1,
    pageSize: 10,
    totalOrders: 0,
    stats: { totalOrders: 0, totalSales: 0, totalTax: 0 },
    searchQuery: "",
    filters: {},
    fetchOrders: async (page) => {
        const targetPage = page ?? get().currentPage;
        set({ isLoading: true });
        try {
            const { filters, pageSize, searchQuery } = get();

            const apiFilters: OrderFilters = {};
            if (filters.county) apiFilters.county = filters.county;
            if (filters.city) apiFilters.city = filters.city;
            if (filters.dateFrom) apiFilters.dateFrom = new Date(filters.dateFrom).toISOString();
            if (filters.dateTo) apiFilters.dateTo = new Date(filters.dateTo).toISOString();
            if (filters.subtotalMin !== undefined) apiFilters.subtotalMin = filters.subtotalMin;
            if (filters.subtotalMax !== undefined) apiFilters.subtotalMax = filters.subtotalMax;
            if (filters.taxRateMin !== undefined) apiFilters.taxRateMin = filters.taxRateMin;
            if (filters.taxRateMax !== undefined) apiFilters.taxRateMax = filters.taxRateMax;
            if (filters.taxMin !== undefined) apiFilters.taxMin = filters.taxMin;
            if (filters.taxMax !== undefined) apiFilters.taxMax = filters.taxMax;
            if (filters.totalMin !== undefined) apiFilters.totalMin = filters.totalMin;
            if (filters.totalMax !== undefined) apiFilters.totalMax = filters.totalMax;

            const [result, stats] = await Promise.all([
                ordersApi.getOrders(targetPage, pageSize, apiFilters),
                ordersApi.getStats(),
            ]);

            let orders = result.data.map(mapApiOrder);

            // Client-side search (backend doesn't support full-text search)
            if (searchQuery.trim()) {
                const terms = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
                orders = orders.filter(o => {
                    const j = o.jurisdictions;
                    const text = `${o.id} ${o.uuid} ${o.timestamp} ${j.state} ${j.county} ${j.city}`.toLowerCase();
                    return terms.every(t => text.includes(t));
                });
            }

            set({
                orders,
                isLoading: false,
                totalOrders: result.total,
                stats,
                currentPage: targetPage,
            });
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            set({ isLoading: false });
        }
    },
    setCurrentPage: (page: number) => {
        set({ currentPage: page });
        get().fetchOrders(page);
    },
    setSearchQuery: (query: string) => {
        set({ searchQuery: query, currentPage: 1 });
        get().fetchOrders(1);
    },
    setFilters: (filters) => {
        set({ filters, currentPage: 1 });
        get().fetchOrders(1);
    },
    addOrder: async (orderData) => {
        try {
            await ordersApi.createOrder({
                latitude: orderData.latitude,
                longitude: orderData.longitude,
                subtotal: orderData.subtotal,
                timestamp: orderData.timestamp,
            });
            await get().fetchOrders();
        } catch (error) {
            console.error("Failed to add order:", error);
        }
    },
    updateOrder: async (id, orderData) => {
        try {
            console.log("Updating order", id, orderData);
            await get().fetchOrders();
        } catch (error) {
            console.error("Failed to update order:", error);
        }
    },
    deleteOrder: async (id) => {
        try {
            console.log("Deleting order", id);
            await get().fetchOrders();
        } catch (error) {
            console.error("Failed to delete order:", error);
        }
    },
    importOrders: async (file) => {
        set({ isLoading: true });
        try {
            const result = await ordersApi.importOrders(file);
            await get().fetchOrders();
            set({ isLoading: false });
            return result;
        } catch (error) {
            console.error("Failed to import orders:", error);
            set({ isLoading: false });
            throw error;
        }
    },
}));
