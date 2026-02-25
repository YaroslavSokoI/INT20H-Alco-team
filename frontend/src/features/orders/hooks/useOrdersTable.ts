import { useState, useEffect, useMemo, useCallback } from "react";
import { useOrderStore } from "@/store/orderStore";
import { getOrderColumns } from "../components/table/columns";
import { formatDate } from "@/lib/formatters";
import { 
    getCoreRowModel, 
    useReactTable,
} from "@tanstack/react-table";
import type { OrderRow } from "../types";

export function useOrdersTable() {
    const { 
        orders, 
        isLoading, 
        fetchOrders, 
        currentPage, 
        totalOrders, 
        pageSize, 
        addOrder,
        updateOrder,
        deleteOrder
    } = useOrderStore();

    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
    const [newOrder, setNewOrder] = useState({
        jurisdiction: "",
        subtotal: "",
        taxRate: "",
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
            taxRate: order.taxRate.toString(),
            tax: order.tax.toString(),
            total: order.total.toString(),
            longitude: order.longitude.toString(),
            latitude: order.latitude.toString()
        });
    }, []);

    const handleEditCancel = useCallback(() => {
        setEditingId(null);
        setEditingOrder(null);
    }, []);

    const handleUpdate = useCallback(async () => {
        if (!editingId) return;
        await updateOrder(editingId, {
            jurisdiction: editingOrder.jurisdiction,
            subtotal: parseFloat(editingOrder.subtotal) || 0,
            taxRate: parseFloat(editingOrder.taxRate) || 0,
            tax: parseFloat(editingOrder.tax) || 0,
            total: parseFloat(editingOrder.total) || 0,
            longitude: parseFloat(editingOrder.longitude) || 0,
            latitude: parseFloat(editingOrder.latitude) || 0
        });
        setEditingId(null);
        setEditingOrder(null);
    }, [editingId, editingOrder, updateOrder]);

    const handleDelete = useCallback(async (id: string) => {
        if (confirm("Are you sure you want to delete this order?")) {
            await deleteOrder(id);
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
        await addOrder({
            date: formatDate(new Date()),
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
            tax: "0.00",
            total: "0.00",
            longitude: "0.00",
            latitude: "0.00"
        });
    }, [addOrder, newOrder]);

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
