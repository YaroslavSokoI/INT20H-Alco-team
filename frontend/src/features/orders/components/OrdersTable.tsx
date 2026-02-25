import { orders } from "../mock";
import { Button } from "@/components/ui/Button";
import {arrowRight, createIcon, filterIcon, importIcon} from "@/assets/assets.ts";

export default function OrdersTable() {
    return (
        <div className="overflow-hidden rounded-xl border border-border bg-white">
            <div className="px-5 py-3">
                <div className="text-lg font-bold">Orders</div>
            </div>

            <div className="border-t border-border px-5 py-2.5">
                <div className="flex items-center justify-between gap-3">
                    <div className="w-full p-1.5 max-w-xs flex items-center gap-0.5 border border-border text-xs rounded-lg">
                        <img src="/search.svg" alt="search icon" className="w-5 h-5 opacity-50"/>
                        <input
                            placeholder="Search..."
                            className="outline-none"
                        />
                    </div>


                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="h-8 py-1 text-xs flex items-center gap-1">
                            <img src={filterIcon} alt=""/>
                            Filter
                        </Button>
                        <Button variant="outline" className="h-8 py-1 text-xs flex items-center gap-1">
                            <img src={importIcon} alt=""/>
                            Import
                        </Button>
                        <Button className="h-8 py-1 text-xs flex items-center gap-1">
                            <img src={createIcon} alt=""/>
                            Create
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="border-t border-border">
                <table className="w-full text-xs">
                    <thead className="bg-black/2 text-text-muted">
                    <tr className="[&>th]:px-5 [&>th]:py-2.5 [&>th]:text-left [&>th]:font-semibold">
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Location</th>
                        <th>Subtotal</th>
                        <th>VAT</th>
                        <th>Total</th>
                        <th className="w-[100px]" />
                    </tr>
                    </thead>

                    <tbody>
                    {orders.map((o) => (
                        <tr
                            key={o.id}
                            className="border-t border-border-light hover:bg-black/[0.01] [&>td]:px-5 [&>td]:py-2.5"
                        >
                            <td className="font-semibold text-primary">{o.id}</td>
                            <td>{o.date}</td>
                            <td>{o.location}</td>
                            <td>${o.subtotal.toFixed(2)}</td>
                            <td>${o.vat.toFixed(2)}</td>
                            <td className="font-medium">${o.total.toFixed(2)}</td>
                            <td className="text-right">
                                <Button className="px-4 py-1.5 text-[11px]">
                                    View
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3 text-[11px] text-text-muted">
                <div>Rows per page: 5</div>

                <div className="flex items-center gap-2">
                    <div>1–5 of 2,350</div>
                    <div className="flex items-center gap-1">
                        <Button size="icon" className="size-7 text-white font-medium">1</Button>
                        <Button variant="outline" size="icon" className="size-7">2</Button>
                        <Button variant="outline" size="icon" className="size-7">3</Button>
                        <Button variant="outline" size="icon" className="size-7">4</Button>
                        <Button variant="outline" size="icon" className="size-7">5</Button>
                        <Button variant="outline" size="icon" className="size-7">
                            <img src={arrowRight} alt="chevron right"/>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}