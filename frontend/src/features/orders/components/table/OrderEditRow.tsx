import { memo } from "react";
import type { CSSProperties } from "react";

interface OrderEditRowProps {
    order: any;
    setOrder: (order: any) => void;
    onSave: () => void;
    onCancel: () => void;
    jurisdictionExpanded: boolean;
    taxExpanded: boolean;
}

const disabledInput = "w-full bg-transparent outline-none pb-0.5 text-text-muted/50 cursor-default";
const editableInput = "w-full bg-transparent border-b border-primary/30 outline-none pb-0.5 focus:border-primary transition-colors";
const readonlyInput = "w-full bg-transparent outline-none pb-0.5 text-text-muted";

const T = 'max-width 0.4s ease, padding-left 0.4s ease, padding-right 0.4s ease, opacity 0.35s ease';
const cs = (show: boolean): CSSProperties =>
    show
        ? { padding: '10px 8px', maxWidth: 300, overflow: 'hidden', transition: T, whiteSpace: 'nowrap' }
        : { maxWidth: 0, paddingLeft: 0, paddingRight: 0, overflow: 'hidden', opacity: 0, transition: T, whiteSpace: 'nowrap' };
const always: CSSProperties = { padding: '10px 8px', whiteSpace: 'nowrap' };

const OrderEditRow = memo(({ order, setOrder, onSave, onCancel, jurisdictionExpanded, taxExpanded }: OrderEditRowProps) => {
    const jd = cs(jurisdictionExpanded);
    const js = cs(!jurisdictionExpanded);
    const td = cs(taxExpanded);

    const recalc = (subtotal: string, taxRate: string) => {
        const sub = parseFloat(subtotal) || 0;
        const rate = parseFloat(taxRate) || 0;
        const tax = sub * rate;
        return { tax: tax.toFixed(4), total: (sub + tax).toFixed(4) };
    };

    return (
        <tr className="border-t border-border-light bg-primary/2 text-text text-xs">
            {/* 1. id */}
            <td style={always}>
                <input className={disabledInput} value={order.id} disabled />
            </td>
            {/* 2. timestamp */}
            <td style={always}>
                <input className={disabledInput} value={order.timestamp ? String(order.timestamp).slice(0, 10) : ''} disabled />
            </td>
            {/* 3. jurisdictionSummary */}
            <td style={js}>
                <span className="text-text-muted/60 text-xs">{[order.city || order.county, order.state].filter(Boolean).join(', ') || '-'}</span>
            </td>
            {/* 4. state */}
            <td style={jd}>
                <input className={disabledInput} value={order.state || ''} disabled />
            </td>
            {/* 5. city */}
            <td style={jd}>
                <input className={disabledInput} value={order.city || ''} disabled />
            </td>
            {/* 6. county */}
            <td style={jd}>
                <input className={disabledInput} value={order.county || ''} disabled />
            </td>
            {/* 7. specialDistrict */}
            <td style={jd}>
                <input className={disabledInput} value={order.specialRates > 0 ? 'MCTD' : '-'} disabled />
            </td>
            {/* 8. postcode */}
            <td style={jd}>
                <input className={disabledInput} value={order.postcode || ''} disabled />
            </td>
            {/* 9. latitude */}
            <td style={jd}>
                <input
                    className={editableInput}
                    placeholder="0.00000"
                    value={order.latitude}
                    onChange={(e) => setOrder({ ...order, latitude: e.target.value })}
                />
            </td>
            {/* 10. longitude */}
            <td style={jd}>
                <input
                    className={editableInput}
                    placeholder="0.00000"
                    value={order.longitude}
                    onChange={(e) => setOrder({ ...order, longitude: e.target.value })}
                />
            </td>
            {/* 11. collapseJurisdiction */}
            <td style={jd}></td>
            {/* 12. subtotal */}
            <td style={always}>
                <input
                    className={editableInput}
                    placeholder="0.00"
                    value={order.subtotal}
                    onChange={(e) => {
                        const { tax, total } = recalc(e.target.value, order.taxRate);
                        setOrder({ ...order, subtotal: e.target.value, tax, total });
                    }}
                />
            </td>
            {/* 13. compositeTaxRate */}
            <td style={always}>
                <input
                    className={editableInput}
                    placeholder="0.00"
                    value={order.taxRate}
                    onChange={(e) => {
                        const { tax, total } = recalc(order.subtotal, e.target.value);
                        setOrder({ ...order, taxRate: e.target.value, tax, total });
                    }}
                />
            </td>
            {/* 14. stateRate */}
            <td style={td}></td>
            {/* 15. countyRate */}
            <td style={td}></td>
            {/* 16. cityRate */}
            <td style={td}></td>
            {/* 17. specialRates */}
            <td style={td}></td>
            {/* 18. collapseTax */}
            <td style={td}></td>
            {/* 19. taxAmount */}
            <td style={always}>
                <input className={readonlyInput} value={order.tax} readOnly />
            </td>
            {/* 20. totalAmount */}
            <td style={always}>
                <input className={`${readonlyInput} font-semibold text-primary`} value={order.total} readOnly />
            </td>
            {/* 21. actions */}
            <td style={{ ...always, width: '96px' }}>
                <div className="flex justify-end gap-3">
                    <button
                        className="text-xs font-semibold text-text-muted hover:opacity-70 transition-opacity cursor-pointer"
                        onClick={onCancel}
                    >
                        cancel
                    </button>
                    <button
                        className="text-xs font-semibold text-primary hover:opacity-70 transition-opacity cursor-pointer"
                        onClick={onSave}
                    >
                        save
                    </button>
                </div>
            </td>
        </tr>
    );
});

export default OrderEditRow;
