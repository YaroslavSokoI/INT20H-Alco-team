import { useState, useEffect, useMemo, useCallback } from "react";
import { useOrderStore } from "@/store/orderStore";
import { getOrderColumns } from "../components/table/columns";
import {
    getCoreRowModel,
    useReactTable,
    type SortingState,
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
        addOrder,
        updateOrder,
        deleteOrder,
        setSorting: setStoreSorting,
        sortBy,
        sortOrder,
    } = useOrderStore();

    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
    const todayDate = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 19);
    };

    const [newOrder, setNewOrder] = useState<any>({
        subtotal: "",
        longitude: "",
        latitude: "",
        timestamp: todayDate(),
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
        setJurisdictionExpanded(true);
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

    const [pendingDeleteId, setPendingDeleteId] = useState<number | string | null>(null);

    const [sorting, setSorting] = useState<SortingState>([{
        id: sortBy || 'timestamp',
        desc: sortOrder === 'asc' ? false : true
    }]);

    const handleSortingChange = useCallback((updater: SortingState | ((prev: SortingState) => SortingState)) => {
        const next = typeof updater === 'function' ? updater(sorting) : updater;
        setSorting(next);
        const first = next[0];
        setStoreSorting(first?.id, first ? (first.desc ? 'desc' : 'asc') : undefined);
    }, [sorting, setStoreSorting]);
    const [jurisdictionExpanded, setJurisdictionExpanded] = useState<boolean>(() => {
        const saved = localStorage.getItem("orderTable_jurisdictionExpanded");
        return saved ? JSON.parse(saved) : false;
    });
    const [taxExpanded, setTaxExpanded] = useState<boolean>(() => {
        const saved = localStorage.getItem("orderTable_taxExpanded");
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        localStorage.setItem("orderTable_jurisdictionExpanded", JSON.stringify(jurisdictionExpanded));
    }, [jurisdictionExpanded]);

    useEffect(() => {
        localStorage.setItem("orderTable_taxExpanded", JSON.stringify(taxExpanded));
    }, [taxExpanded]);

    useEffect(() => {
        if (isCreating) setJurisdictionExpanded(true);
    }, [isCreating]);

    const toggleJurisdiction = useCallback(() => setJurisdictionExpanded(prev => !prev), []);
    const toggleTax = useCallback(() => setTaxExpanded(prev => !prev), []);

    const handleDelete = useCallback((id: number | string) => {
        setPendingDeleteId(id);
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        if (pendingDeleteId === null) return;
        await deleteOrder(pendingDeleteId.toString());
        setPendingDeleteId(null);
    }, [pendingDeleteId, deleteOrder]);

    const handleDeleteCancel = useCallback(() => {
        setPendingDeleteId(null);
    }, []);

    const handleExpand = useCallback((order: OrderRow) => {
        setSelectedOrder(order);
    }, []);

    const columns = useMemo(() => getOrderColumns(
        handleExpand, handleEditStart, handleDelete, pendingDeleteId, handleDeleteConfirm, handleDeleteCancel,
        toggleJurisdiction, toggleTax, taxExpanded,
    ), [handleExpand, handleEditStart, handleDelete, pendingDeleteId, handleDeleteConfirm, handleDeleteCancel, toggleJurisdiction, toggleTax, taxExpanded]);

    const table = useReactTable({
        data: orders,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualSorting: true,
        enableSortingRemoval: false,
        onSortingChange: handleSortingChange,
        state: { sorting },
        meta: { taxExpanded },
    });

    const totalPages = Math.max(1, Math.ceil(totalOrders / pageSize));

    const handlePageChange = useCallback((page: number) => {
        if (page >= 1 && page <= totalPages) {
            fetchOrders(page);
        }
    }, [totalPages, fetchOrders]);

    const handleCreate = useCallback(async () => {
        const subtotal = parseFloat(newOrder.subtotal);
        const longitude = parseFloat(newOrder.longitude);
        const latitude = parseFloat(newOrder.latitude);
        if (isNaN(subtotal) || isNaN(longitude) || isNaN(latitude)) return;
        await addOrder({
            subtotal,
            longitude,
            latitude,
            timestamp: newOrder.timestamp ? new Date(newOrder.timestamp).toISOString() : new Date().toISOString()
        });
        setNewOrder({ subtotal: "", longitude: "", latitude: "", timestamp: todayDate() });
        setIsCreating(false);
    }, [newOrder, addOrder]);

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
        handleEditCancel,
        jurisdictionExpanded,
        taxExpanded,
    };
}
