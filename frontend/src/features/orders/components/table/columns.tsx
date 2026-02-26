import { createColumnHelper } from "@tanstack/react-table";
import type { OrderRow } from "@/types/order.ts";
import { formatCurrency, formatPercent, formatDate } from "@/lib/formatters";

const columnHelper = createColumnHelper<OrderRow>();

export const getOrderColumns = (
    onExpand: (order: OrderRow) => void,
    onEdit: (order: OrderRow) => void,
    onDelete: (id: number | string) => void,
    pendingDeleteId: number | string | null,
    onDeleteConfirm: () => void,
    onDeleteCancel: () => void,
) => [
    columnHelper.accessor("uuid", {
        header: "Order ID",
        cell: info => {
            const val = info.getValue();
            const display = val ? `${val.substring(0, 8)}...` : `${info.row.original.id}`;
            return <span className="font-semibold text-primary text-xs">{display}</span>;
        },
    }),
    columnHelper.accessor("timestamp", {
        header: "Order Date",
        cell: info => {
            const val = info.getValue();
            return val ? formatDate(val) : 'N/A';
        },
    }),
    columnHelper.accessor("jurisdictions.city", {
        header: "City",
        cell: info => info.getValue() || 'N/A',
    }),
    columnHelper.accessor("subtotal", {
        header: "Subtotal",
        cell: info => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor("compositeTaxRate", {
        header: "Tax Rate",
        cell: info => formatPercent(info.getValue() * 100),
    }),
    columnHelper.accessor("taxAmount", {
        header: "Tax",
        cell: info => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor("totalAmount", {
        header: "Total",
        cell: info => <span className="font-medium">{formatCurrency(info.getValue())}</span>,
    }),
    columnHelper.accessor("longitude", {
        header: "Longitude",
    }),
    columnHelper.accessor("latitude", {
        header: "Latitude",
    }),
    columnHelper.display({
        id: "actions",
        cell: info => {
            const id = info.row.original.id;
            const isPending = pendingDeleteId === id;

            return (
                <div className={`flex items-center gap-3 ${isPending ? "justify-start -ml-16" : "justify-end"}`}>
                    {!isPending && (
                        <>
                            <button onClick={() => onExpand(info.row.original)} className="text-xs font-semibold text-primary hover:opacity-70 transition-opacity cursor-pointer">
                                expand
                            </button>
                            <button onClick={() => onEdit(info.row.original)} className="text-xs font-semibold text-yellow-500 hover:opacity-70 transition-opacity cursor-pointer">
                                edit
                            </button>
                        </>
                    )}
                    {isPending ? (
                        <span className="flex items-center gap-3 w-full justify-start">
                            <span className="text-xs text-text-muted">Are you sure?</span>
                            <button onClick={onDeleteConfirm} className="text-xs font-semibold text-red-500 hover:opacity-70 transition-opacity cursor-pointer">
                                Yes
                            </button>
                            <button onClick={onDeleteCancel} className="text-xs font-semibold text-text-muted hover:opacity-70 transition-opacity cursor-pointer">
                                No
                            </button>
                        </span>
                    ) : (
                        <button onClick={() => onDelete(id)} className="text-xs font-semibold text-red-500 hover:opacity-70 transition-opacity cursor-pointer">
                            delete
                        </button>
                    )}
                </div>
            );
        },
    }),
];
