import { createIcon } from "@/assets/assets.ts";

interface OrderCreateRowProps {
    newOrder: any;
    setNewOrder: (order: any) => void;
    onSave: () => void;
}

export default function OrderCreateRow({ newOrder, setNewOrder, onSave }: OrderCreateRowProps) {
    return (
        <tr className="border-t border-border-light bg-black/[0.02] [&>td]:px-5 [&>td]:py-2 text-text-muted">
            <td>
                <input 
                    className="w-full bg-transparent border-b border-border/50 outline-none pb-0.5 placeholder:text-text-muted/50" 
                    placeholder="default=auto"
                    disabled
                />
            </td>
            <td>
                <input 
                    className="w-full bg-transparent border-b border-border/50 outline-none pb-0.5 placeholder:text-text-muted/50" 
                    placeholder="default=today"
                    disabled
                />
            </td>
            <td>
                <input 
                    className="w-full bg-transparent border-b border-border/50 outline-none pb-0.5 placeholder:text-text-muted/50" 
                    placeholder="Jurisdiction"
                    value={newOrder.jurisdiction}
                    onChange={(e) => setNewOrder({...newOrder, jurisdiction: e.target.value})}
                />
            </td>
            <td>
                <input 
                    className="w-full bg-transparent border-b border-border/50 outline-none pb-0.5 placeholder:text-text-muted/50" 
                    placeholder="0.00"
                    value={newOrder.subtotal}
                    onChange={(e) => setNewOrder({...newOrder, subtotal: e.target.value})}
                />
            </td>
            <td>
                <input 
                    className="w-full bg-transparent border-b border-border/50 outline-none pb-0.5 placeholder:text-text-muted/50" 
                    placeholder="0.00"
                    value={newOrder.taxRate}
                    onChange={(e) => setNewOrder({...newOrder, taxRate: e.target.value})}
                />
            </td>
            <td>
                <input 
                    className="w-full bg-transparent border-b border-border/50 outline-none pb-0.5 placeholder:text-text-muted/50" 
                    placeholder="0.00"
                    value={newOrder.tax}
                    onChange={(e) => setNewOrder({...newOrder, tax: e.target.value})}
                />
            </td>
            <td>
                <input 
                    className="w-full bg-transparent border-b border-border/50 outline-none pb-0.5 placeholder:text-text-muted/50" 
                    placeholder="0.00"
                    value={newOrder.total}
                    onChange={(e) => setNewOrder({...newOrder, total: e.target.value})}
                />
            </td>
            <td>
                <input 
                    className="w-full bg-transparent border-b border-border/50 outline-none pb-0.5 placeholder:text-text-muted/50" 
                    placeholder="0.00"
                    value={newOrder.longitude}
                    onChange={(e) => setNewOrder({...newOrder, longitude: e.target.value})}
                />
            </td>
            <td>
                <input 
                    className="w-full bg-transparent border-b border-border/50 outline-none pb-0.5 placeholder:text-text-muted/50" 
                    placeholder="0.00"
                    value={newOrder.latitude}
                    onChange={(e) => setNewOrder({...newOrder, latitude: e.target.value})}
                />
            </td>
            <td className="px-5">
                <div className="flex justify-end">
                    <button 
                        className="size-8 flex items-center justify-center rounded-lg bg-success hover:bg-success/80 text-success transition-all border border-success/20 shadow-xs"
                        onClick={onSave}
                        title="Save order"
                    >
                        <img src={createIcon} alt="Save" className="size-5" />
                    </button>
                </div>
            </td>
        </tr>
    );
}
