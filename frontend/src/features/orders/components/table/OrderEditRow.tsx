import { createIcon } from "@/assets/assets.ts";
import { memo } from "react";

interface OrderEditRowProps {
    order: any;
    setOrder: (order: any) => void;
    onSave: () => void;
    onCancel: () => void;
}

const OrderEditRow = memo(({ order, setOrder, onSave, onCancel }: OrderEditRowProps) => {
    return (
        <tr className="border-t border-border-light bg-primary/[0.02] [&>td]:px-5 [&>td]:py-2 text-text">
            <td>
                <input 
                    className="w-full bg-transparent border-b border-border/50 outline-none pb-0.5 text-text-muted" 
                    value={order.id}
                    disabled
                />
            </td>
            <td>
                <input 
                    className="w-full bg-transparent border-b border-border/50 outline-none pb-0.5 text-text-muted" 
                    value={order.date}
                    disabled
                />
            </td>
            <td>
                <input 
                    className="w-full bg-transparent border-b border-primary/30 outline-none pb-0.5 focus:border-primary transition-colors" 
                    placeholder="Jurisdiction"
                    value={order.jurisdiction}
                    onChange={(e) => {
                        setOrder({...order, jurisdiction: e.target.value});
                    }}
                />
            </td>
            <td>
                <input 
                    className="w-full bg-transparent border-b border-primary/30 outline-none pb-0.5 focus:border-primary transition-colors" 
                    placeholder="0.00"
                    value={order.subtotal}
                    onChange={(e) => {
                        const subtotal = parseFloat(e.target.value) || 0;
                        const taxRate = parseFloat(order.taxRate) || 0;
                        const tax = (subtotal * taxRate) / 100;
                        const total = subtotal + tax;
                        setOrder({
                            ...order, 
                            subtotal: e.target.value,
                            tax: tax.toFixed(2),
                            total: total.toFixed(2)
                        });
                    }}
                />
            </td>
            <td>
                <input 
                    className="w-full bg-transparent border-b border-primary/30 outline-none pb-0.5 focus:border-primary transition-colors" 
                    placeholder="0.00"
                    value={order.taxRate}
                    onChange={(e) => {
                        const taxRate = parseFloat(e.target.value) || 0;
                        const subtotal = parseFloat(order.subtotal) || 0;
                        const tax = (subtotal * taxRate) / 100;
                        const total = subtotal + tax;
                        setOrder({
                            ...order, 
                            taxRate: e.target.value,
                            tax: tax.toFixed(2),
                            total: total.toFixed(2)
                        });
                    }}
                />
            </td>
            <td>
                <input 
                    className="w-full bg-transparent border-b border-border/50 outline-none pb-0.5 text-text-muted" 
                    placeholder="0.00"
                    value={order.tax}
                    readOnly
                />
            </td>
            <td>
                <input 
                    className="w-full bg-transparent border-b border-border/50 outline-none pb-0.5 font-bold text-primary" 
                    placeholder="0.00"
                    value={order.total}
                    readOnly
                />
            </td>
            <td>
                <input 
                    className="w-full bg-transparent border-b border-primary/30 outline-none pb-0.5 focus:border-primary transition-colors" 
                    placeholder="0.00"
                    value={order.longitude}
                    onChange={(e) => setOrder({...order, longitude: e.target.value})}
                />
            </td>
            <td>
                <input 
                    className="w-full bg-transparent border-b border-primary/30 outline-none pb-0.5 focus:border-primary transition-colors" 
                    placeholder="0.00"
                    value={order.latitude}
                    onChange={(e) => setOrder({...order, latitude: e.target.value})}
                />
            </td>
            <td className="px-5">
                <div className="flex justify-end gap-2">
                    <button 
                        className="size-8 flex items-center justify-center rounded-lg bg-success hover:bg-success/80 text-success transition-all border border-success/20 shadow-xs"
                        onClick={onSave}
                        title="Save changes"
                    >
                        <img src={createIcon} alt="Save" className="size-5" />
                    </button>
                    <button 
                        className="size-8 flex items-center justify-center rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all border border-red-500/20 shadow-xs"
                        onClick={onCancel}
                        title="Cancel"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                    </button>
                </div>
            </td>
        </tr>
    );
});

export default OrderEditRow;