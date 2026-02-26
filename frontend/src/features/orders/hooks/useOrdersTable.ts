import { useState, useEffect, useMemo, useCallback } from "react";
import { useOrderStore } from "@/store/orderStore";
import { getOrderColumns } from "../components/table/columns";
import { 
    getCoreRowModel, 
    useReactTable,
} from "@tanstack/react-table";
import type { OrderRow } from "@/types/order";

export function useOrdersTable() {
    const { 
        orders, 
        isLoading, 
        fetchOrders, 
        currentPage, 
        totalOrders, 
        pageSize,
        updateOrder,
        deleteOrder
    } = useOrderStore();

    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
    const [newOrder, setNewOrder] = useState<any>({
        jurisdiction: "",
        subtotal: "",
        taxRate: "0",
        tax: "0.00",
        total: "0.00",
        longitude: "0.00",
        latitude: "0.00"
    });

    const [editingOrder, setEditingOrder] = useState<any>(null);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleEditStart = useCallback((order: OrderRow) => {
        setEditingId(order.id);
        setEditingOrder({
            ...order,
            subtotal: order.subtotal.toString(),
            taxRate: order.compositeTaxRate.toString(),
            tax: order.taxAmount.toString(),
            total: order.totalAmount.toString(),
            longitude: order.longitude.toString(),
            latitude: order.latitude.toString()
        });
    }, []);

    const handleEditCancel = useCallback(() => {
        setEditingId(null);
        setEditingOrder(null);
    }, []);

    const handleUpdate = useCallback(async () => {
        if (editingId === null) return;
        await updateOrder(editingId.toString(), {
            subtotal: parseFloat(editingOrder.subtotal) || 0,
            compositeTaxRate: parseFloat(editingOrder.taxRate) || 0,
            taxAmount: parseFloat(editingOrder.tax) || 0,
            totalAmount: parseFloat(editingOrder.total) || 0,
            longitude: parseFloat(editingOrder.longitude) || 0,
            latitude: parseFloat(editingOrder.latitude) || 0
        });
        setEditingId(null);
        setEditingOrder(null);
    }, [editingId, editingOrder, updateOrder]);

    const handleDelete = useCallback(async (id: number | string) => {
        if (confirm("Are you sure you want to delete this order?")) {
            await deleteOrder(id.toString());
        }
    }, [deleteOrder]);

    const handleExpand = useCallback((order: OrderRow) => {
        setSelectedOrder(order);
    }, []);

    const columns = useMemo(() => getOrderColumns(handleExpand, handleEditStart, handleDelete), [handleExpand, handleEditStart, handleDelete]);

    const table = useReactTable({
        data: orders,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const totalPages = Math.max(1, Math.ceil(totalOrders / pageSize));

    const handlePageChange = useCallback((page: number) => {
        if (page >= 1 && page <= totalPages) {
            fetchOrders(page);
        }
    }, [totalPages, fetchOrders]);

    const handleCreate = useCallback(async () => {
        // ... implementation for addOrder (should be updated in store to real API)
        setIsCreating(false);
    }, []);

    return {
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
    };
}
