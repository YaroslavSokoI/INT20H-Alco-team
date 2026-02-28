import { memo, useState } from "react";
import type { CSSProperties } from "react";

interface OrderCreateRowProps {
    newOrder: any;
    setNewOrder: (order: any) => void;
    onSave: () => void;
    onCancel: () => void;
    jurisdictionExpanded: boolean;
    taxExpanded: boolean;
}

const inputClass = "w-full bg-transparent border-b border-border/50 outline-none pb-0.5 placeholder:text-text-muted/50 focus:border-primary/50 transition-colors";
const emptyCell = <span className="text-text-muted/30">—</span>;

const T = 'max-width 0.4s ease, padding-left 0.4s ease, padding-right 0.4s ease, opacity 0.35s ease';
const cs = (show: boolean): CSSProperties =>
    show
        ? { padding: '10px 8px', maxWidth: 300, overflow: 'hidden', transition: T, whiteSpace: 'nowrap' }
        : { maxWidth: 0, paddingLeft: 0, paddingRight: 0, overflow: 'hidden', opacity: 0, transition: T, whiteSpace: 'nowrap' };
const always: CSSProperties = { padding: '10px 8px', whiteSpace: 'nowrap' };

const OrderCreateRow = memo(({ newOrder, setNewOrder, onSave, onCancel, jurisdictionExpanded, taxExpanded }: OrderCreateRowProps) => {
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        await onSave();
        setSaving(false);
    };

    const jd = cs(jurisdictionExpanded);   // jurisdiction detail cols
    const js = cs(!jurisdictionExpanded);  // jurisdiction summary col
    const td = cs(taxExpanded);            // tax detail cols

    return (
        <tr className="border-t border-border-light bg-black/2 text-text-muted text-xs">
            {/* 1. id */}
            <td style={always}>{emptyCell}</td>
            {/* 2. timestamp */}
            <td style={always}>
                <input
                    type="datetime-local"
                    step="1"
                    className={inputClass}
                    value={newOrder.timestamp}
                    onChange={(e) => setNewOrder({ ...newOrder, timestamp: e.target.value })}
                />
            </td>
            {/* 3. jurisdictionSummary */}
            <td style={js}>{emptyCell}</td>
            {/* 4. state */}
            <td style={jd}>{emptyCell}</td>
            {/* 6. city */}
            <td style={jd}>{emptyCell}</td>
            {/* 6. county */}
            <td style={jd}>{emptyCell}</td>
            {/* 7. specialDistrict */}
            <td style={jd}>{emptyCell}</td>
            {/* 8. postcode */}
            <td style={jd}>{emptyCell}</td>
            {/* 9. latitude */}
            <td style={jd}>
                <input
                    type="number"
                    className={inputClass}
                    placeholder="40.71427"
                    value={newOrder.latitude}
                    onChange={(e) => setNewOrder({ ...newOrder, latitude: e.target.value })}
                />
            </td>
            {/* 10. longitude */}
            <td style={jd}>
                <input
                    type="number"
                    className={inputClass}
                    placeholder="-74.00597"
                    value={newOrder.longitude}
                    onChange={(e) => setNewOrder({ ...newOrder, longitude: e.target.value })}
                />
            </td>
            {/* 11. collapseJurisdiction */}
            <td style={jd}></td>
            {/* 12. subtotal */}
            <td style={always}>
                <input
                    type="number"
                    className={inputClass}
                    placeholder="0.00"
                    value={newOrder.subtotal}
                    onChange={(e) => setNewOrder({ ...newOrder, subtotal: e.target.value })}
                />
            </td>
            {/* 13. compositeTaxRate */}
            <td style={always}>{emptyCell}</td>
            {/* 14. stateRate */}
            <td style={td}>{emptyCell}</td>
            {/* 15. countyRate */}
            <td style={td}>{emptyCell}</td>
            {/* 16. cityRate */}
            <td style={td}>{emptyCell}</td>
            {/* 17. specialRates */}
            <td style={td}>{emptyCell}</td>
            {/* 18. collapseTax */}
            <td style={td}></td>
            {/* 19. taxAmount */}
            <td style={always}>{emptyCell}</td>
            {/* 20. totalAmount */}
            <td style={always}>{emptyCell}</td>
            {/* 21. actions */}
            <td style={{ ...always, width: '96px' }}>
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
