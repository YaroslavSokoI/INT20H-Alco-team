import { useEffect, useRef } from "react";
import type { OrderRow } from "../features/orders/types";
import { Button } from "./ui/Button";

interface OrderDetailModalProps {
    order: OrderRow | null;
    onClose: () => void;
}

export default function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!order) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    const details = [
        { label: "Order ID", value: order.id },
        { label: "Order Date", value: order.date },
        { label: "Jurisdiction", value: order.jurisdiction },
        { label: "Subtotal", value: `$${order.subtotal.toFixed(2)}` },
        { label: "Tax Rate", value: `${order.taxRate.toFixed(2)}%` },
        { label: "Tax", value: `$${order.tax.toFixed(2)}` },
        { label: "Total", value: `$${order.total.toFixed(2)}`, highlight: true },
        { label: "Longitude", value: order.longitude },
        { label: "Latitude", value: order.latitude },
    ];

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            <div 
                ref={modalRef}
                className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-text">Order Details</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-black/5 transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                    {details.map((item) => (
                        <div key={item.label} className={item.highlight ? "col-span-2 bg-primary/5 p-3 rounded-xl border border-primary/10" : ""}>
                            <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-0.5">
                                {item.label}
                            </div>
                            <div className={`text-sm ${item.highlight ? "text-primary font-bold text-lg" : "text-text font-medium"}`}>
                                {item.value}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-end">
                    <Button onClick={onClose} className="px-8">
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
}
