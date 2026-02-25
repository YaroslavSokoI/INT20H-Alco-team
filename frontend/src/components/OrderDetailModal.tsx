import { useRef, memo } from "react";
import type { OrderRow } from "../features/orders/types";
import { Button } from "./ui/Button";
import { useKeydown } from "@/hooks/useKeydown";
import { useClickOutside } from "@/hooks/useClickOutside";
import { formatCurrency, formatPercent } from "@/lib/formatters";

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
        { label: "Order ID", value: order.id, icon: "🆔" },
        { label: "Order Date", value: order.date, icon: "📅" },
        { label: "Jurisdiction", value: order.jurisdiction, icon: "📍" },
        { label: "Subtotal", value: formatCurrency(order.subtotal), icon: "💰" },
        { label: "Tax Rate", value: formatPercent(order.taxRate), icon: "📊" },
        { label: "Tax", value: formatCurrency(order.tax), icon: "💸" },
        { label: "Total", value: formatCurrency(order.total), highlight: true, icon: "🧾" },
        { label: "Longitude", value: order.longitude, icon: "🌐" },
        { label: "Latitude", value: order.latitude, icon: "🌐" },
    ];

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in duration-200"
        >
            <div 
                ref={modalRef}
                className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl transition-all scale-in-center animate-in zoom-in-95 duration-200"
            >
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-text tracking-tight">Order Details</h2>
                        <p className="text-sm text-text-muted font-medium">Detailed information about order #{order.id}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="size-10 flex items-center justify-center rounded-xl bg-black/5 hover:bg-black/10 transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {details.map((item) => (
                        <div 
                            key={item.label} 
                            className={`p-4 rounded-2xl border transition-all ${
                                item.highlight 
                                ? "col-span-2 bg-primary/5 border-primary/20 shadow-sm" 
                                : "bg-surface/30 border-border/50 hover:border-border"
                            }`}
                        >
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-xs opacity-70">{item.icon}</span>
                                <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                                    {item.label}
                                </div>
                            </div>
                            <div className={`leading-none ${
                                item.highlight 
                                ? "text-primary font-black text-3xl" 
                                : "text-text font-bold text-base"
                            }`}>
                                {item.value}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 flex gap-3">
                    <Button variant="outline" onClick={onClose} className="flex-1 h-12 rounded-xl font-bold">
                        Print Receipt
                    </Button>
                    <Button onClick={onClose} className="flex-1 h-12 rounded-xl font-bold shadow-lg shadow-primary/20">
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
});

export default OrderDetailModal;
