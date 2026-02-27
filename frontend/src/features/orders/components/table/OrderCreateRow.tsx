import { memo, useState } from "react";

interface OrderCreateRowProps {
    newOrder: any;
    setNewOrder: (order: any) => void;
    onSave: () => void;
    onCancel: () => void;
}

const inputClass = "w-full bg-transparent border-b border-border/50 outline-none pb-0.5 placeholder:text-text-muted/50 focus:border-primary/50 transition-colors";
const emptyCell = <span className="text-text-muted/40">—</span>;

const OrderCreateRow = memo(({ newOrder, setNewOrder, onSave, onCancel }: OrderCreateRowProps) => {
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        await onSave();
        setSaving(false);
    };

    return (
        <tr className="border-t border-border-light bg-black/2 [&>td]:px-5 [&>td]:py-2 text-text-muted">
            <td>{emptyCell}</td>
            <td>
                <input
                    type="datetime-local"
                    step="1"
                    className={inputClass}
                    value={newOrder.timestamp}
                    onChange={(e) => setNewOrder({ ...newOrder, timestamp: e.target.value })}
                />
            </td>
            <td>{emptyCell}</td>
            <td>
                <input
                    type="number"
                    className={inputClass}
                    placeholder="0.00"
                    value={newOrder.subtotal}
                    onChange={(e) => setNewOrder({ ...newOrder, subtotal: e.target.value })}
                />
            </td>
            <td>{emptyCell}</td>
            <td>{emptyCell}</td>
            <td>{emptyCell}</td>
            <td>
                <input
                    type="number"
                    className={inputClass}
                    placeholder="0.00000"
                    value={newOrder.longitude}
                    onChange={(e) => setNewOrder({ ...newOrder, longitude: e.target.value })}
                />
            </td>
            <td>
                <input
                    type="number"
                    className={inputClass}
                    placeholder="0.00000"
                    value={newOrder.latitude}
                    onChange={(e) => setNewOrder({ ...newOrder, latitude: e.target.value })}
                />
            </td>
            <td className="px-5">
                <div className="flex justify-end gap-3">
                    <button
                        className={`text-xs font-semibold transition-opacity cursor-pointer ${saving ? "text-text-muted pointer-events-none" : "text-primary hover:opacity-70"}`}
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? "creating..." : "create"}
                    </button>
                    <button
                        className="text-xs font-semibold transition-all cursor-pointer text-red-500 hover:opacity-70"
                        onClick={onCancel}
                        disabled={saving}
                    >
                        cancel
                    </button>
                </div>
            </td>
        </tr>
    );
});

export default OrderCreateRow;
