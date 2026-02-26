import { createColumnHelper } from "@tanstack/react-table";
import type { OrderRow } from "@/types/order.ts";
import { editIcon, deleteIcon, expandIcon } from "@/assets/assets";
import { formatCurrency, formatPercent } from "@/lib/formatters";

const columnHelper = createColumnHelper<OrderRow>();

export const getOrderColumns = (
    onExpand: (order: OrderRow) => void,
    onEdit: (order: OrderRow) => void,
    onDelete: (id: string) => void
) => [
    columnHelper.accessor("uuid", {
        header: "Order UUID",
        cell: info => {
            const val = info.getValue();
            return <span className="font-semibold text-primary text-xs">{val ? `${val.substring(0, 8)}...` : 'N/A'}</span>;
        },
    }),
    columnHelper.accessor("timestamp", {
        header: "Order Date",
        cell: info => {
            const val = info.getValue();
            return val ? new Date(val).toLocaleDateString() : 'N/A';
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
        cell: info => (
            <div className="flex items-center justify-end gap-2">
                <button 
                    onClick={() => onExpand(info.row.original)}
                    className="size-8 flex items-center justify-center rounded-lg bg-primary hover:bg-primary/70 transition-all shadow-xs group"
                    title="Expand"
                >
                    <img src={expandIcon} alt="Expand" className="size-5 group-hover:opacity-100 transition-opacity" />
                </button>
                <button 
                    onClick={() => onEdit(info.row.original)}
                    className="size-8 flex items-center justify-center rounded-lg bg-yellow-500 hover:bg-yellow-600 transition-all shadow-xs group" 
                    title="Edit"
                >
                    <img src={editIcon} alt="Edit" className="size-5 group-hover:opacity-100 transition-opacity" />
                </button>
                <button 
                    onClick={() => onDelete(info.row.original.id)}
                    className="size-8 flex items-center justify-center rounded-lg bg-red-500 hover:bg-red-600 transition-all shadow-xs group" 
                    title="Delete"
                >
                    <img src={deleteIcon} alt="Delete" className="size-5 group-hover:opacity-100 transition-all" />
                </button>
            </div>
        ),
    }),
];