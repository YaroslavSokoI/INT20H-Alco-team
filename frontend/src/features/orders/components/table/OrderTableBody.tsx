import { Skeleton } from "@/components/ui/Skeleton";
import OrderCreateRow from "./OrderCreateRow";
import OrderEditRow from "./OrderEditRow";
import { flexRender, type Table } from "@tanstack/react-table";
import type { OrderRow } from "@/types/order.ts";
import { memo } from "react";
import type { CSSProperties } from "react";

const SortIcon = ({ sorted }: { sorted: false | 'asc' | 'desc' }) => (
    <svg width="14" height="14" viewBox="0 0 10 10" fill="none" className="shrink-0 inline-block">
        <path d="M3 3.5L5 1.5L7 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={sorted === 'asc' ? 1 : 0.3} />
        <path d="M3 6.5L5 8.5L7 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={sorted === 'desc' ? 1 : 0.3} />
    </svg>
);

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
    jurisdictionExpanded: boolean;
    taxExpanded: boolean;
}

const JURISDICTION_DETAIL_COLS = new Set(['state', 'city', 'county', 'specialDistrict', 'postcode', 'latitude', 'longitude', 'collapseJurisdiction']);
const TAX_DETAIL_COLS = new Set(['stateRate', 'countyRate', 'cityRate', 'specialRates', 'collapseTax']);

const T = 'max-width 0.4s ease, padding-left 0.4s ease, padding-right 0.4s ease, opacity 0.35s ease';
const HIDE: CSSProperties = { maxWidth: 0, paddingLeft: 0, paddingRight: 0, overflow: 'hidden', opacity: 0, transition: T, whiteSpace: 'nowrap' };
const SHOW: CSSProperties = { maxWidth: 300, overflow: 'hidden', transition: T, whiteSpace: 'nowrap' };
const SHOW_SUMMARY: CSSProperties = { maxWidth: 200, overflow: 'hidden', transition: T, whiteSpace: 'nowrap' };

const colBg = (id: string, taxExp = false) => {
    if (JURISDICTION_DETAIL_COLS.has(id)) return 'bg-black/[0.025]';
    if (TAX_DETAIL_COLS.has(id)) return 'bg-black/[0.025]';
    if (id === 'compositeTaxRate' && taxExp) return 'bg-black/[0.025]';
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
    handleEditCancel,
    jurisdictionExpanded,
    taxExpanded,
}: OrderTableBodyProps) => {

    const getColStyle = (colId: string): CSSProperties => {
        if (JURISDICTION_DETAIL_COLS.has(colId)) return jurisdictionExpanded ? SHOW : HIDE;
        if (colId === 'jurisdictionSummary') return jurisdictionExpanded ? HIDE : SHOW_SUMMARY;
        if (TAX_DETAIL_COLS.has(colId)) return taxExpanded ? SHOW : HIDE;
        if (colId === 'compositeTaxRate') return SHOW_SUMMARY;
        return {};
    };

    return (
        <div className="border-t border-border overflow-x-auto">
            <table className="w-full text-xs">
                <thead className="bg-black/2 text-black/80">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id} className="[&>th]:py-2.5 [&>th]:text-left [&>th]:font-semibold">
                            {headerGroup.headers.map(header => (
                                <th
                                    key={header.id}
                                    className={[colBg(header.id, taxExpanded), header.column.getCanSort() ? 'cursor-pointer select-none' : ''].filter(Boolean).join(' ') || undefined}
                                    style={{
                                        ...getColStyle(header.id),
                                        width: header.id === 'actions' ? '96px' : header.column.columnDef.size ? `${header.column.columnDef.size}px` : 'auto',
                                        paddingLeft: getColStyle(header.id).paddingLeft ?? '8px',
                                        paddingRight: getColStyle(header.id).paddingRight ?? '8px',
                                    }}
                                    onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                                >
                                    {header.isPlaceholder ? null : (
                                        <span className="inline-flex items-center gap-1">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getCanSort() && <SortIcon sorted={header.column.getIsSorted()} />}
                                        </span>
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
                        jurisdictionExpanded={jurisdictionExpanded}
                        taxExpanded={taxExpanded}
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
                                    jurisdictionExpanded={jurisdictionExpanded}
                                    taxExpanded={taxExpanded}
                                />
                            );
                        }
                        return (
                            <tr
                                key={row.id}
                                className="border-t border-border-light hover:bg-black/1"
                            >
                                {row.getVisibleCells().map(cell => (
                                    <td
                                        key={cell.id}
                                        className={colBg(cell.column.id, taxExpanded) || undefined}
                                        style={{
                                            ...getColStyle(cell.column.id),
                                            paddingLeft: getColStyle(cell.column.id).paddingLeft ?? '8px',
                                            paddingRight: getColStyle(cell.column.id).paddingRight ?? '8px',
                                            paddingTop: '10px',
                                            paddingBottom: '10px',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
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
