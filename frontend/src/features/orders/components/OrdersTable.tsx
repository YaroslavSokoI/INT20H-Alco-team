import OrderTableActions from "./table/OrderTableActions";
import OrderTableBody from "./table/OrderTableBody";
import OrderTablePagination from "./table/OrderTablePagination";
import OrderDetailModal from "@/components/OrderDetailModal";
import ImportResultModal from "@/components/ImportResultModal";
import { useOrdersTable } from "../hooks/useOrdersTable";
import { useOrderStore } from "@/store/orderStore";
import { useState } from "react";

export default function OrdersTable() {
    const { importOrders } = useOrderStore();
    const [importResult, setImportResult] = useState<any>(null);

    const {
        table,
        isLoading,
        isCreating,
        setIsCreating,
        editingId,
        editingOrder,
        setEditingOrder,
        selectedOrder,
        setSelectedOrder,
        newOrder,
        setNewOrder,
        currentPage,
        pageSize,
        totalOrders,
        totalPages,
        handlePageChange,
        handleCreate,
        handleUpdate,
        handleEditCancel
    } = useOrdersTable();

    const handleImport = async (file: File) => {
        try {
            const result = await importOrders(file);
            setImportResult(result);
        } catch (error) {
            console.error("Import failed", error);
        }
    };

    return (
        <div className="overflow-hidden rounded-xl border border-border bg-white">
            <div className="px-5 py-3">
                <div className="text-lg font-bold">Orders</div>
            </div>

            <OrderTableActions 
                onImport={handleImport}
                onCreate={() => setIsCreating(true)}
            />

            <OrderTableBody 
                table={table}
                isLoading={isLoading}
                isCreating={isCreating}
                newOrder={newOrder}
                setNewOrder={setNewOrder}
                handleCreate={handleCreate}
                editingId={editingId}
                editingOrder={editingOrder}
                setEditingOrder={setEditingOrder}
                handleUpdate={handleUpdate}
                handleEditCancel={handleEditCancel}
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

            <ImportResultModal 
                result={importResult} 
                onClose={() => setImportResult(null)} 
            />
        </div>
    );
}