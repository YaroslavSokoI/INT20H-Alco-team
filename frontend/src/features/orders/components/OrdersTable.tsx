import { useState, useEffect } from "react";
import { useOrderStore } from "@/store/orderStore";
import OrderTableActions from "./table/OrderTableActions";
import OrderTableBody from "./table/OrderTableBody";
import OrderTablePagination from "./table/OrderTablePagination";
import OrderDetailModal from "@/components/OrderDetailModal";
import type { OrderRow } from "../types";

export default function OrdersTable() {
    const { orders, isLoading, fetchOrders, currentPage, totalOrders, pageSize, addOrder } = useOrderStore();
    const [isCreating, setIsCreating] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
    const [newOrder, setNewOrder] = useState({
        jurisdiction: "",
        subtotal: "",
        taxRate: "",
        tax: "",
        total: "",
        longitude: "",
        latitude: ""
    });

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const totalPages = Math.ceil(totalOrders / pageSize);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            fetchOrders(page);
        }
    };

    const handleCreate = async () => {
        await addOrder({
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            jurisdiction: newOrder.jurisdiction || "New York, NY",
            subtotal: parseFloat(newOrder.subtotal) || 0,
            taxRate: parseFloat(newOrder.taxRate) || 0,
            tax: parseFloat(newOrder.tax) || 0,
            total: parseFloat(newOrder.total) || 0,
            longitude: parseFloat(newOrder.longitude) || 0,
            latitude: parseFloat(newOrder.latitude) || 0
        });
        setIsCreating(false);
        setNewOrder({
            jurisdiction: "",
            subtotal: "",
            taxRate: "",
            tax: "",
            total: "",
            longitude: "",
            latitude: ""
        });
    };

    return (
        <div className="overflow-hidden rounded-xl border border-border bg-white">
            <div className="px-5 py-3">
                <div className="text-lg font-bold">Orders</div>
            </div>

            <OrderTableActions 
                onSearch={(v) => console.log("Search:", v)} 
                onFilter={() => console.log("Filter")}
                onImport={() => console.log("Import")}
                onCreate={() => setIsCreating(true)}
            />

            <OrderTableBody 
                orders={orders}
                isLoading={isLoading}
                isCreating={isCreating}
                newOrder={newOrder}
                setNewOrder={setNewOrder}
                handleCreate={handleCreate}
                onExpand={(o) => setSelectedOrder(o)}
            />

            <OrderTablePagination 
                currentPage={currentPage}
                pageSize={pageSize}
                totalOrders={totalOrders}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            <OrderDetailModal 
                order={selectedOrder} 
                onClose={() => setSelectedOrder(null)} 
            />
        </div>
    );
}