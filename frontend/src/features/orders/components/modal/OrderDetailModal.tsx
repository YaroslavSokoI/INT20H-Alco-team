import { useRef, memo } from "react";
import type { OrderRow } from "@/types/order";
import { Button } from "@/components/ui/Button";
import { useKeydown } from "@/hooks/useKeydown";
import { useClickOutside } from "@/hooks/useClickOutside";
import {formatCurrency, formatDate, formatPercent} from "@/lib/formatters";

interface OrderDetailModalProps {
    order: OrderRow | null;
    onClose: () => void;
}

const OrderDetailModal = memo(({ order, onClose }: OrderDetailModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useKeydown("Escape", onClose);
    useClickOutside(modalRef, onClose);

    if (!order) return null;

    const details = [
        { label: "ID", value: String(order.id), highlight: true },
        { label: "Order Date", value: order.timestamp ? formatDate(order.timestamp) : "N/A" },
        { label: "City", value: order.city || "N/A" },
        { label: "County", value: order.county || "N/A" },
        { label: "State", value: order.state || "N/A" },
        { label: "Postcode", value: order.postcode || "N/A" },
        { label: "Subtotal", value: formatCurrency(order.subtotal) },
        { label: "Tax Rate", value: formatPercent((order.compositeTaxRate || 0) * 100) },
        { label: "Tax Amount", value: formatCurrency(order.taxAmount) },
        { label: "Total Amount", value: formatCurrency(order.totalAmount), highlight: true },
        { label: "State Rate", value: formatPercent((order.stateRate || 0) * 100) },
        { label: "County Rate", value: formatPercent((order.countyRate || 0) * 100) },
        { label: "City Rate", value: formatPercent((order.cityRate || 0) * 100) },
        { label: "Special Rates", value: formatPercent((order.specialRates || 0) * 100) },
    ];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px] animate-in fade-in duration-200"
        >
            <div
                ref={modalRef}
                className="w-full max-w-lg rounded-lg bg-white shadow-xl animate-in zoom-in-95 duration-200"
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <div>
                        <h2 className="text-base font-semibold text-text tracking-tight">Order Details</h2>
                        <p className="text-xs text-text-muted">Order #{order.id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="size-8 flex items-center justify-center rounded-md text-text-muted hover:bg-black/5 hover:text-text transition-colors"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-px bg-border p-0 border-b border-border">
                    {details.map((item) => (
                        <div
                            key={item.label}
                            className={`px-5 py-3.5 bg-white ${item.highlight ? "col-span-2 bg-primary/3" : ""}`}
                        >
                            <div className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">
                                {item.label}
                            </div>
                            <div className={`${
                                item.highlight
                                ? "text-primary font-bold text-xl"
                                : "text-text font-semibold text-sm"
                            }`}>
                                {item.value}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="px-6 py-3 flex justify-end">
                    <Button onClick={onClose} className="h-8 px-4 text-xs rounded-md font-medium">
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
});

export default OrderDetailModal;
