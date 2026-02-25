import OrderTableActions from "./table/OrderTableActions";
import OrderTableBody from "./table/OrderTableBody";
import OrderTablePagination from "./table/OrderTablePagination";
import OrderDetailModal from "@/components/OrderDetailModal";
import { useOrdersTable } from "../hooks/useOrdersTable";

export default function OrdersTable() {
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

    return (
        <div className="overflow-hidden rounded-xl border border-border bg-white">
            <div className="px-5 py-3">
                <div className="text-lg font-bold">Orders</div>
            </div>

            <OrderTableActions 
                onImport={() => console.log("Import")}
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
        </div>
    );
}