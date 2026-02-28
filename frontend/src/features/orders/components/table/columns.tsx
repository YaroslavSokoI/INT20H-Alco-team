import { createColumnHelper } from "@tanstack/react-table";
import type { OrderRow } from "@/types/order.ts";
import { formatCurrency, formatPercent, formatDate } from "@/lib/formatters";

const columnHelper = createColumnHelper<OrderRow>();

const ChevronRight = () => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2l4 3-4 3" />
    </svg>
);

const ChevronLeft = () => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 2l-4 3 4 3" />
    </svg>
);

export const getOrderColumns = (
    onExpand: (order: OrderRow) => void,
    onEdit: (order: OrderRow) => void,
    onDelete: (id: number | string) => void,
    pendingDeleteId: number | string | null,
    onDeleteConfirm: () => void,
    onDeleteCancel: () => void,
    onToggleJurisdiction: () => void,
    jurisdictionExpanded: boolean,
    onToggleTax: () => void,
    taxExpanded: boolean,
) => [
        columnHelper.accessor("id", {
            header: "ID",
            cell: info => <span className="font-semibold text-primary text-xs">{info.getValue()}</span>,
        }),
        columnHelper.accessor("timestamp", {
            header: "Order Date",
            cell: info => {
                const val = info.getValue();
                return val ? formatDate(val) : 'N/A';
            },
        }),

        // ── Jurisdiction collapsed ─────────────────────────────────────────────
        columnHelper.display({
            id: 'jurisdictionSummary',
            size: 160,
            enableSorting: true,
            header: () => jurisdictionExpanded ? (
                <span className="font-semibold">Jurisdiction</span>
            ) : (
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleJurisdiction(); }}
                    className="flex items-center gap-1 font-semibold text-inherit hover:text-primary transition-colors cursor-pointer"
                >
                    Jurisdiction <ChevronRight />
                </button>
            ),
            cell: info => {
                const { city, county, state } = info.row.original;
                const place = city || county || '';
                return [place, state].filter(Boolean).join(', ') || 'N/A';
            },
        }),

        // ── Jurisdiction expanded ──────────────────────────────────────────────
        columnHelper.display({
            id: 'collapseJurisdiction',
            size: 110,
            header: () => (
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleJurisdiction(); }}
                    className="flex items-center gap-1 font-semibold text-text-muted hover:text-primary transition-colors cursor-pointer"
                    title="Collapse"
                >
                    <ChevronLeft /> Jurisdiction
                </button>
            ),
            cell: () => null,
        }),
        columnHelper.accessor("state", {
            header: "State",
            cell: info => info.getValue() || '-',
        }),
        columnHelper.accessor("city", {
            header: "City",
            cell: info => info.getValue() || '-',
        }),
        columnHelper.accessor("county", {
            header: "County",
            cell: info => info.getValue() || '-',
        }),
        columnHelper.accessor("specialRates", {
            id: 'specialDistrict',
            header: 'Special District',
            cell: info => info.getValue() > 0 ? 'MCTD' : '-',
        }),
        columnHelper.accessor("postcode", {
            header: "Postcode",
            cell: info => info.getValue() || '-',
        }),
        columnHelper.accessor("latitude", { header: "Latitude" }),
        columnHelper.accessor("longitude", { header: "Longitude" }),
        // ── Always visible ─────────────────────────────────────────────────────
        columnHelper.accessor("subtotal", {
            header: "Subtotal",
            cell: info => formatCurrency(info.getValue()),
        }),

        // ── Tax Rate (with expand toggle) ──────────────────────────────────────
        columnHelper.accessor("compositeTaxRate", {
            header: () => taxExpanded ? (
                <span className="font-semibold">Tax Rate</span>
            ) : (
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleTax(); }}
                    className="flex items-center gap-1 font-semibold text-inherit hover:text-primary transition-colors"
                >
                    Tax Rate <ChevronRight />
                </button>
            ),
            cell: info => formatPercent(info.getValue() * 100),
        }),

        // ── Tax breakdown expanded ─────────────────────────────────────────────
        columnHelper.accessor("stateRate", {
            header: "State Rate",
            cell: info => formatPercent(info.getValue() * 100),
        }),
        columnHelper.accessor("countyRate", {
            header: "County Rate",
            cell: info => formatPercent(info.getValue() * 100),
        }),
        columnHelper.accessor("cityRate", {
            header: "City Rate",
            cell: info => formatPercent(info.getValue() * 100),
        }),
        columnHelper.accessor("specialRates", {
            header: "Special Rates",
            cell: info => formatPercent(info.getValue() * 100),
        }),
        columnHelper.display({
            id: 'collapseTax',
            size: 70,
            header: () => (
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleTax(); }}
                    className="flex items-center gap-1 font-semibold text-text-muted hover:text-primary transition-colors"
                    title="Collapse"
                >
                    <ChevronLeft /> Taxes
                </button>
            ),
            cell: () => null,
        }),
        // ── Always visible ─────────────────────────────────────────────────────
        columnHelper.accessor("taxAmount", {
            header: "Tax",
            cell: info => formatCurrency(info.getValue()),
        }),
        columnHelper.accessor("totalAmount", {
            header: "Total",
            cell: info => <span className="font-medium">{formatCurrency(info.getValue())}</span>,
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
                                <button onClick={onDeleteConfirm} className="text-xs font-semibold text-red-500 hover:opacity-70 transition-opacity cursor-pointer">Yes</button>
                                <button onClick={onDeleteCancel} className="text-xs font-semibold text-text-muted hover:opacity-70 transition-opacity cursor-pointer">No</button>
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
