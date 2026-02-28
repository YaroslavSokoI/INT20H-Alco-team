import OrderTableActions from "./table/OrderTableActions";
import OrderTableBody from "./table/OrderTableBody";
import OrderTablePagination from "./table/OrderTablePagination";
import OrderDetailModal from "@/features/orders/components/modal/OrderDetailModal";
import ImportResultModal from "@/features/orders/components/modal/ImportResultModal";
import ImportModal from "./table/ImportModal";
import { useOrdersTable } from "../hooks/useOrdersTable";
import { useOrderStore } from "@/store/orderStore";
import { useState } from "react";

export default function OrdersTable() {
    const { importOrders, setPageSize } = useOrderStore();
    const [importResult, setImportResult] = useState<any>(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

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
        handleEditCancel,
        jurisdictionExpanded,
        taxExpanded,
    } = useOrdersTable();

    const handleImport = async (file: File) => {
        try {
            const result = await importOrders(file);
            setImportResult(result);
        } catch (error) {
            const message =
                (error as any)?.response?.data?.error ||
                (error instanceof Error ? error.message : 'Import failed');
            setImportResult({ imported: 0, skipped: 0, errors: [{ row: 0, reason: message }] });
        }
    };

    return (
        <div className="overflow-hidden rounded-xl border border-border bg-white">
            <div className="px-5 py-3">
                <div className="text-lg font-bold">Orders</div>
            </div>

            <OrderTableActions
                onImport={() => setIsImportModalOpen(true)}
                onCreate={() => setIsCreating(true)}
                isCreating={isCreating}
            />

            <OrderTableBody
                table={table}
                isLoading={isLoading}
                isCreating={isCreating}
                newOrder={newOrder}
                setNewOrder={setNewOrder}
                handleCreate={handleCreate}
                handleCreateCancel={() => setIsCreating(false)}
                editingId={editingId}
                editingOrder={editingOrder}
                setEditingOrder={setEditingOrder}
                handleUpdate={handleUpdate}
                handleEditCancel={handleEditCancel}
                jurisdictionExpanded={jurisdictionExpanded}
                taxExpanded={taxExpanded}
            />

            <OrderTablePagination
                currentPage={currentPage}
                pageSize={pageSize}
                totalOrders={totalOrders}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onPageSizeChange={setPageSize}
            />

            <OrderDetailModal 
                order={selectedOrder} 
                onClose={() => setSelectedOrder(null)} 
            />

            <ImportResultModal 
                result={importResult} 
                onClose={() => setImportResult(null)} 
            />

            <ImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImport={handleImport}
            />

        </div>
    );
}