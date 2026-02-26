import { create } from "zustand";
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
        city?: string;
    };
    fetchOrders: (page?: number) => Promise<void>;
    setCurrentPage: (page: number) => void;
    setSearchQuery: (query: string) => void;
    setFilters: (filters: OrderState["filters"]) => void;
    addOrder: (order: any) => Promise<void>;
    updateOrder: (id: string, order: Partial<OrderRow>) => Promise<void>;
    deleteOrder: (id: string) => Promise<void>;
    importOrders: (file: File) => Promise<any>;
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
            const response = await ordersApi.getOrders(targetPage, get().pageSize);
            
            // Note: Since backend filters might not be fully implemented yet in getOrders call,
            // we keep a simple client-side search/filter logic if needed, 
            // but ideally we should pass these to the API.
            
            set({ 
                orders: response.orders || (response as any).data || [], 
                isLoading: false, 
                totalOrders: response.total || 0,
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
            await ordersApi.createOrder(orderData);
            await get().fetchOrders();
        } catch (error) {
            console.error("Failed to add order:", error);
        }
    },
    updateOrder: async (id, orderData) => {
        try {
            // Placeholder for real API call
            console.log("Updating order", id, orderData);
            await get().fetchOrders();
        } catch (error) {
            console.error("Failed to update order:", error);
        }
    },
    deleteOrder: async (id) => {
        try {
            // Placeholder for real API call
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
