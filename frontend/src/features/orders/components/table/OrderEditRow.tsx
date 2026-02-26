import { memo } from "react";

interface OrderEditRowProps {
    order: any;
    setOrder: (order: any) => void;
    onSave: () => void;
    onCancel: () => void;
}

const OrderEditRow = memo(({ order, setOrder, onSave, onCancel }: OrderEditRowProps) => {
    return (
        <tr className="border-t border-border-light bg-primary/2 [&>td]:px-5 [&>td]:py-2 text-text">
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
                <div className="flex justify-end gap-3">
                    <button
                        className="text-xs font-semibold underline underline-offset-2 transition-all cursor-pointer text-text-muted hover:opacity-70"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="text-xs font-semibold underline underline-offset-2 transition-all cursor-pointer text-primary hover:opacity-70"
                        onClick={onSave}
                    >
                        Save
                    </button>
                </div>
            </td>
        </tr>
    );
});

export default OrderEditRow;