import { create } from "zustand";
import { orders as mockOrders } from "@/features/orders/mock";
import type { OrderRow } from "@/types/order";
import { ordersApi } from "@/api/orders";

interface OrderState {
    orders: OrderRow[];
    isLoading: boolean;
    currentPage: number;
    pageSize: number;
    totalOrders: number;
    searchQuery: string;
    filters: {
        dateRange?: { from: string; to: string };
        totalRange?: { min: number; max: number };
    };
    fetchOrders: (page?: number) => Promise<void>;
    setCurrentPage: (page: number) => void;
    setSearchQuery: (query: string) => void;
    setFilters: (filters: OrderState["filters"]) => void;
    addOrder: (order: Omit<OrderRow, "id">) => Promise<void>;
    updateOrder: (id: string, order: Partial<OrderRow>) => Promise<void>;
    deleteOrder: (id: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
    orders: [],
    isLoading: false,
    currentPage: 1,
    pageSize: 10,
    totalOrders: 0,
    searchQuery: "",
    filters: {},
    fetchOrders: async (page) => {
        const targetPage = page ?? get().currentPage;
        set({ isLoading: true });
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            
            let filteredOrders = [...mockOrders];

            // Search
            const query = get().searchQuery.toLowerCase().trim();
            if (query) {
                const searchTerms = query.split(/\s+/).filter(Boolean);
                filteredOrders = filteredOrders.filter(o => {
                    const rowText = `${o.id} ${o.date} ${o.jurisdiction}`.toLowerCase();
                    // Перевіряємо, чи кожне слово з пошуку присутнє в рядку (це дозволяє шукати "New 1001")
                    return searchTerms.every(term => rowText.includes(term));
                });
            }

            // Filters
            const { filters } = get();
            if (filters.dateRange) {
                const from = new Date(filters.dateRange.from);
                const to = new Date(filters.dateRange.to);
                filteredOrders = filteredOrders.filter(o => {
                    const d = new Date(o.date);
                    return d >= from && d <= to;
                });
            }
            if (filters.totalRange) {
                filteredOrders = filteredOrders.filter(o => 
                    o.total >= (filters.totalRange?.min ?? 0) && 
                    o.total <= (filters.totalRange?.max ?? Infinity)
                );
            }

            const start = (targetPage - 1) * get().pageSize;
            const paginatedOrders = filteredOrders.slice(start, start + get().pageSize);

            set({ 
                orders: paginatedOrders, 
                isLoading: false, 
                totalOrders: filteredOrders.length,
                currentPage: targetPage
            });
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            set({ isLoading: false });
        }
    },
    setCurrentPage: (page: number) => set({ currentPage: page }),
    setSearchQuery: (query: string) => {
        set({ searchQuery: query, currentPage: 1 });
        get().fetchOrders();
    },
    setFilters: (filters) => {
        set({ filters, currentPage: 1 });
        get().fetchOrders();
    },
    addOrder: async (orderData) => {
        try {
            const newOrder: OrderRow = {
                ...orderData,
                id: Math.floor(Math.random() * 1000).toString(),
            };
            
            // В реальному додатку ми б зробили API call тут
            // Для моків додаємо в початок списку
            mockOrders.unshift(newOrder);
            
            await get().fetchOrders();
        } catch (error) {
            console.error("Failed to add order:", error);
        }
    },
    updateOrder: async (id, orderData) => {
        try {
            const index = mockOrders.findIndex(o => o.id === id);
            if (index !== -1) {
                mockOrders[index] = { ...mockOrders[index], ...orderData };
                await get().fetchOrders();
            }
        } catch (error) {
            console.error("Failed to update order:", error);
        }
    },
    deleteOrder: async (id) => {
        try {
            const index = mockOrders.findIndex(o => o.id === id);
            if (index !== -1) {
                mockOrders.splice(index, 1);
                await get().fetchOrders();
            }
        } catch (error) {
            console.error("Failed to delete order:", error);
        }
    },
}));
