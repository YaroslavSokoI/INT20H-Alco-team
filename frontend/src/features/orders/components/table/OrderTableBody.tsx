import { Skeleton } from "@/components/ui/Skeleton";
import type { OrderRow } from "../../types";
import OrderCreateRow from "./OrderCreateRow";
import { editIcon, deleteIcon, expandIcon } from "@/assets/assets";

interface OrderTableBodyProps {
    orders: OrderRow[];
    isLoading: boolean;
    isCreating: boolean;
    newOrder: any;
    setNewOrder: (order: any) => void;
    handleCreate: () => void;
    onExpand: (order: OrderRow) => void;
}

export default function OrderTableBody({ 
    orders, 
    isLoading, 
    isCreating, 
    newOrder, 
    setNewOrder, 
    handleCreate,
    onExpand
}: OrderTableBodyProps) {
    return (
        <div className="border-t border-border overflow-x-auto">
            <table className="w-full text-xs">
                <thead className="bg-black/2 text-text-muted">
                <tr className="[&>th]:px-5 [&>th]:py-2.5 [&>th]:text-left [&>th]:font-semibold whitespace-nowrap">
                    <th>Order ID</th>
                    <th>Order Date</th>
                    <th>Jurisdiction</th>
                    <th>Subtotal</th>
                    <th>Tax Rate</th>
                    <th>Tax</th>
                    <th>Total</th>
                    <th>Longitude</th>
                    <th>Latitude</th>
                    <th className="w-24 px-5"></th>
                </tr>
                </thead>

                <tbody className="relative">
                {isCreating && (
                    <OrderCreateRow 
                        newOrder={newOrder} 
                        setNewOrder={setNewOrder} 
                        onSave={handleCreate} 
                    />
                )}

                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="border-t border-border-light [&>td]:px-5 [&>td]:py-2.5">
                            {Array.from({ length: 9 }).map((_, j) => (
                                <td key={j}><Skeleton className="h-4 w-full" /></td>
                            ))}
                            <td className="px-5">
                                <div className="flex justify-end gap-2">
                                    <Skeleton className="size-8 rounded-lg" />
                                    <Skeleton className="size-8 rounded-lg" />
                                    <Skeleton className="size-8 rounded-lg" />
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    orders.map((o) => (
                        <tr
                            key={o.id}
                            className="border-t border-border-light hover:bg-black/[0.01] [&>td]:px-5 [&>td]:py-2.5 whitespace-nowrap"
                        >
                            <td className="font-semibold text-primary">{o.id}</td>
                            <td>{o.date}</td>
                            <td>{o.jurisdiction}</td>
                            <td>${o.subtotal.toFixed(2)}</td>
                            <td>{o.taxRate.toFixed(2)}%</td>
                            <td>${o.tax.toFixed(2)}</td>
                            <td className="font-medium">${o.total.toFixed(2)}</td>
                            <td>{o.longitude}</td>
                            <td>{o.latitude}</td>
                            <td className="px-5">
                                <div className="flex items-center justify-end gap-2">
                                    <button 
                                        onClick={() => onExpand(o)}
                                        className="size-8 flex items-center justify-center rounded-lg bg-primary hover:bg-primary/70 transition-all shadow-xs group"
                                        title="Expand"
                                    >
                                        <img src={expandIcon} alt="Expand" className="size-5 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                    <button className="size-8 flex items-center justify-center rounded-lg bg-yellow-500 hover:bg-yellow-600 transition-all shadow-xs group" title="Edit">
                                        <img src={editIcon} alt="Edit" className="size-5 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                    <button className="size-8 flex items-center justify-center rounded-lg bg-red-500 hover:bg-red-600 transition-all shadow-xs group" title="Delete">
                                        <img src={deleteIcon} alt="Delete" className="size-5 group-hover:opacity-100 group-hover:filter group-hover:sepia group-hover:hue-rotate-[320deg] group-hover:saturate-200 transition-all" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}
