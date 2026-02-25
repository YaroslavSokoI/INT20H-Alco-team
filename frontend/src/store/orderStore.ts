import { create } from "zustand";
import { orders as mockOrders } from "@/features/orders/mock";
import type { OrderRow } from "@/features/orders/types";

interface OrderState {
    orders: OrderRow[];
    isLoading: boolean;
    currentPage: number;
    pageSize: number;
    totalOrders: number;
    fetchOrders: (page?: number) => Promise<void>;
    setCurrentPage: (page: number) => void;
    addOrder: (order: Omit<OrderRow, "id">) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
    orders: [],
    isLoading: false,
    currentPage: 1,
    pageSize: 10,
    totalOrders: 0,
    fetchOrders: async (page) => {
        const targetPage = page ?? get().currentPage;
        set({ isLoading: true });
        try {
            // В майбутньому тут буде axios.get(`/api/orders?page=${targetPage}&limit=${get().pageSize}`)
            await new Promise((resolve) => setTimeout(resolve, 500));
            
            // Емуляція пагінації з моковими даними
            // Оскільки в mockOrders лише 10 елементів, ми можемо створити більше для тесту
            const allMockOrders = Array.from({ length: 45 }).map((_, i) => ({
                ...mockOrders[0],
                id: String(i + 1),
            }));

            const start = (targetPage - 1) * get().pageSize;
            const paginatedOrders = allMockOrders.slice(start, start + get().pageSize);

            set({ 
                orders: paginatedOrders, 
                isLoading: false, 
                totalOrders: allMockOrders.length,
                currentPage: targetPage
            });
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            set({ isLoading: false });
        }
    },
    setCurrentPage: (page: number) => set({ currentPage: page }),
    addOrder: async (orderData) => {
        // В майбутньому тут буде axios.post('/api/orders', orderData)
        const newOrder: OrderRow = {
            ...orderData,
            id: Math.floor(Math.random() * 1000).toString(),
        };
        set((state) => ({
            orders: [newOrder, ...state.orders].slice(0, state.pageSize),
            totalOrders: state.totalOrders + 1
        }));
    },
}));
