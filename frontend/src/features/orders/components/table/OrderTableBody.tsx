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
    handleCreateCancel: () => void;
    editingId: number | string | null | undefined;
    editingOrder: any;
    setEditingOrder: (order: any) => void;
    handleUpdate: () => void;
    handleEditCancel: () => void;
}

const JURISDICTION_COLS = new Set(['state', 'city', 'county', 'specialDistrict', 'postcode', 'latitude', 'longitude', 'collapseJurisdiction']);
const TAX_COLS = new Set(['stateRate', 'countyRate', 'cityRate', 'specialRates']);

const colBg = (id: string) => {
    if (JURISDICTION_COLS.has(id)) return 'bg-black/[0.025]';
    if (TAX_COLS.has(id)) return 'bg-black/[0.025]';
    return '';
};

const OrderTableBody = memo(({
    table, 
    isLoading, 
    isCreating, 
    newOrder, 
    setNewOrder, 
    handleCreate,
    handleCreateCancel,
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
                        <tr key={headerGroup.id} className="[&>th]:px-2 [&>th]:py-2.5 [&>th]:text-left [&>th]:font-semibold whitespace-nowrap">
                            {headerGroup.headers.map(header => (
                                <th key={header.id} className={colBg(header.id)} style={{ width: header.id === 'actions' ? '96px' : header.column.columnDef.size ? `${header.column.columnDef.size}px` : 'auto', maxWidth: header.column.columnDef.size ? `${header.column.columnDef.size}px` : undefined }}>
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
                        onCancel={handleCreateCancel}
                    />
                )}

                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="border-t border-border-light [&>td]:px-2 [&>td]:py-2.5">
                            {Array.from({ length: 9 }).map((_, j) => (
                                <td key={j}><Skeleton className="h-4 w-full" /></td>
                            ))}
                            <td>
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
                        if (row.original.id.toString() === editingId?.toString()) {
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
                                className="border-t border-border-light hover:bg-black/1 [&>td]:px-2 [&>td]:py-2.5 whitespace-nowrap"
                            >
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} style={{ maxWidth: cell.column.columnDef.size ? `${cell.column.columnDef.size}px` : undefined }} className={[cell.column.columnDef.size ? 'truncate' : '', colBg(cell.column.id)].filter(Boolean).join(' ') || undefined}>
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
