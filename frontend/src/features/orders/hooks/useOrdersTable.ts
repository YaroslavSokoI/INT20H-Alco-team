import { useState, useEffect, useMemo, useCallback } from "react";
import { useOrderStore } from "@/store/orderStore";
import { getOrderColumns } from "../components/table/columns";
import {
    getCoreRowModel,
    useReactTable,
    type VisibilityState,
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
        deleteOrder
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

    const [taxExpanded, setTaxExpanded] = useState(false);

    const jurisdictionDetailCols = ['state', 'city', 'county', 'specialDistrict', 'postcode', 'latitude', 'longitude', 'collapseJurisdiction'];
    const taxDetailCols = ['stateRate', 'countyRate', 'cityRate', 'specialRates'];

    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        jurisdictionSummary: true,
        state: false,
        city: false,
        county: false,
        specialDistrict: false,
        postcode: false,
        latitude: false,
        longitude: false,
        collapseJurisdiction: false,
        stateRate: false,
        countyRate: false,
        cityRate: false,
        specialRates: false,
    });

    const toggleJurisdiction = useCallback(() => {
        setColumnVisibility(v => {
            const next = !v['state'];
            return {
                ...v,
                jurisdictionSummary: !next,
                ...Object.fromEntries(jurisdictionDetailCols.map(c => [c, next])),
            };
        });
    }, []);

    const toggleTax = useCallback(() => {
        setTaxExpanded(prev => {
            const next = !prev;
            setColumnVisibility(v => ({
                ...v,
                ...Object.fromEntries(taxDetailCols.map(c => [c, next])),
            }));
            return next;
        });
    }, []);

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
        toggleJurisdiction,
        taxExpanded, toggleTax,
    ), [handleExpand, handleEditStart, handleDelete, pendingDeleteId, handleDeleteConfirm, handleDeleteCancel, toggleJurisdiction, taxExpanded, toggleTax]);

    const table = useReactTable({
        data: orders,
        columns,
        state: { columnVisibility },
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
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
    };
}
