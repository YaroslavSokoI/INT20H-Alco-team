import { Skeleton } from "@/components/ui/Skeleton";
import OrderCreateRow from "./OrderCreateRow";
import OrderEditRow from "./OrderEditRow";
import { flexRender, type Table } from "@tanstack/react-table";
import type { OrderRow } from "@/types/order.ts";
import { memo } from "react";

interface OrderTableBodyProps {
    table: Table<OrderRow>;
    isLoading: boolean;
    isCreating: boolean;
    newOrder: any;
    setNewOrder: (order: any) => void;
    handleCreate: () => void;
    editingId: string | null;
    editingOrder: any;
    setEditingOrder: (order: any) => void;
    handleUpdate: () => void;
    handleEditCancel: () => void;
}

const OrderTableBody = memo(({ 
    table, 
    isLoading, 
    isCreating, 
    newOrder, 
    setNewOrder, 
    handleCreate,
    editingId,
    editingOrder,
    setEditingOrder,
    handleUpdate,
    handleEditCancel
}: OrderTableBodyProps) => {
    return (
        <div className="border-t border-border overflow-x-auto">
            <table className="w-full text-xs">
                <thead className="bg-black/2 text-text-muted">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id} className="[&>th]:px-5 [&>th]:py-2.5 [&>th]:text-left [&>th]:font-semibold whitespace-nowrap">
                            {headerGroup.headers.map(header => (
                                <th key={header.id} style={{ width: header.id === 'actions' ? '96px' : 'auto' }}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody className="relative">
                {isCreating && (
                    <OrderCreateRow 
                        newOrder={newOrder} 
                        setNewOrder={setNewOrder} 
                        onSave={handleCreate} 
                    />
                )}

                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="border-t border-border-light [&>td]:px-5 [&>td]:py-2.5">
                            {Array.from({ length: 9 }).map((_, j) => (
                                <td key={j}><Skeleton className="h-4 w-full" /></td>
                            ))}
                            <td className="px-5">
                                <div className="flex justify-end gap-2">
                                    <Skeleton className="size-8 rounded-lg" />
                                    <Skeleton className="size-8 rounded-lg" />
                                    <Skeleton className="size-8 rounded-lg" />
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    table.getRowModel().rows.map(row => {
                        if (row.original.id === editingId) {
                            return (
                                <OrderEditRow 
                                    key={row.id}
                                    order={editingOrder}
                                    setOrder={setEditingOrder}
                                    onSave={handleUpdate}
                                    onCancel={handleEditCancel}
                                />
                            );
                        }
                        return (
                            <tr
                                key={row.id}
                                className="border-t border-border-light hover:bg-black/[0.01] [&>td]:px-5 [&>td]:py-2.5 whitespace-nowrap"
                            >
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        );
                    })
                )}
                </tbody>
            </table>
        </div>
    );
});

export default OrderTableBody;
