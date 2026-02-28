import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OrderRow } from "@/types/order";
import { ordersApi, type ApiOrder, type OrderFilters, type OrderStats } from "@/api/orders";

function mapApiOrder(order: ApiOrder): OrderRow {
    return { ...order };
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
    sortBy: string | undefined;
    sortOrder: 'asc' | 'desc' | undefined;
    fetchOrders: (page?: number, skipStats?: boolean) => Promise<void>;
    setSorting: (sortBy: string | undefined, sortOrder: 'asc' | 'desc' | undefined) => void;
    setCurrentPage: (page: number) => void;
    setPageSize: (size: number) => void;
    setSearchQuery: (query: string) => void;
    setFilters: (filters: OrderFilters) => void;
    addOrder: (order: { latitude: number; longitude: number; subtotal: number; timestamp?: string }) => Promise<void>;
    updateOrder: (id: string, order: Partial<OrderRow>) => Promise<void>;
    deleteOrder: (id: string) => Promise<void>;
    deleteSelected: () => Promise<number>;
    importOrders: (file: File) => Promise<unknown>;
    exportOrders: (format?: 'csv' | 'json') => Promise<void>;
}

export const useOrderStore = create<OrderState>()(
    persist(
        (set, get) => ({
            orders: [],
            isLoading: false,
            currentPage: 1,
            pageSize: 10,
            totalOrders: 0,
            stats: { totalOrders: 0, totalSales: 0, totalTax: 0, totalImports: 0, deltaOrders: 0, deltaSales: 0, deltaTax: 0, deltaImports: 0 },
            searchQuery: "",
            filters: {},
            sortBy: 'timestamp',
            sortOrder: 'desc',
            fetchOrders: async (page, skipStats = false) => {
                const targetPage = page ?? get().currentPage;
                set({ isLoading: true });
                try {
                    const { filters, pageSize, searchQuery, sortBy, sortOrder } = get();

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
                    if (searchQuery.trim()) apiFilters.search = searchQuery.trim();
                    if (sortBy) apiFilters.sortBy = sortBy;
                    if (sortOrder) apiFilters.sortOrder = sortOrder;

                    const ordersRequest = ordersApi.getOrders(targetPage, pageSize, apiFilters);

                    if (skipStats) {
                        const result = await ordersRequest;
                        set({
                            orders: result.data.map(mapApiOrder),
                            isLoading: false,
                            totalOrders: result.total,
                            currentPage: targetPage,
                        });
                    } else {
                        const [result, stats] = await Promise.all([ordersRequest, ordersApi.getStats()]);
                        set({
                            orders: result.data.map(mapApiOrder),
                            isLoading: false,
                            totalOrders: result.total,
                            stats,
                            currentPage: targetPage,
                        });
                    }
                } catch (error) {
                    console.error("Failed to fetch orders:", error);
                    set({ isLoading: false });
                }
            },
            setCurrentPage: (page: number) => {
                set({ currentPage: page });
                get().fetchOrders(page);
            },
            setPageSize: (size: number) => {
                set({ pageSize: size, currentPage: 1 });
                get().fetchOrders(1);
            },
            setSearchQuery: (query: string) => {
                set({ searchQuery: query, currentPage: 1 });
                get().fetchOrders(1);
            },
            setFilters: (filters) => {
                set({ filters, currentPage: 1 });
                get().fetchOrders(1);
            },
            setSorting: (sortBy, sortOrder) => {
                set({ sortBy, sortOrder, currentPage: 1 });
                get().fetchOrders(1, true);
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
                    await ordersApi.updateOrder(id, orderData);
                    await get().fetchOrders();
                } catch (error) {
                    console.error("Failed to update order:", error);
                }
            },
            deleteOrder: async (id) => {
                try {
                    await ordersApi.deleteOrder(id);
                    await get().fetchOrders();
                } catch (error) {
                    console.error("Failed to delete order:", error);
                }
            },
            deleteSelected: async () => {
                const { filters, searchQuery } = get();
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
                if (searchQuery.trim()) apiFilters.search = searchQuery.trim();

                const { deleted } = await ordersApi.deleteSelected(apiFilters);
                await get().fetchOrders();
                return deleted;
            },
            exportOrders: async (format: 'csv' | 'json' = 'csv') => {
                const { filters, searchQuery, sortBy, sortOrder } = get();
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
                if (searchQuery.trim()) apiFilters.search = searchQuery.trim();
                if (sortBy) apiFilters.sortBy = sortBy;
                if (sortOrder) apiFilters.sortOrder = sortOrder;

                const orders = await ordersApi.exportOrders(apiFilters);

                let blob: Blob;
                let filename: string;

                if (format === 'json') {
                    const json = JSON.stringify(orders, null, 2);
                    blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
                    filename = `orders-${new Date().toISOString().slice(0, 10)}.json`;
                } else {
                    const headers = ['ID', 'UUID', 'Date', 'State', 'City', 'County', 'Postcode', 'Latitude', 'Longitude', 'Subtotal', 'Tax Rate', 'State Rate', 'County Rate', 'City Rate', 'Special Rates', 'Tax', 'Total'];
                    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
                    const rows = orders.map(o => [
                        o.id, o.uuid, o.timestamp, o.state, o.city, o.county, o.postcode,
                        o.latitude, o.longitude, o.subtotal, o.compositeTaxRate,
                        o.stateRate, o.countyRate, o.cityRate, o.specialRates,
                        o.taxAmount, o.totalAmount,
                    ].map(esc).join(','));
                    const csv = [headers.map(esc).join(','), ...rows].join('\n');

                    blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                    filename = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
                }

                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                URL.revokeObjectURL(url);
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
            }
        }),
        {
            name: "order-store",
            partialize: (state) => ({
                pageSize: state.pageSize,
                sortBy: state.sortBy,
                sortOrder: state.sortOrder,
            }),
        }
    ));
