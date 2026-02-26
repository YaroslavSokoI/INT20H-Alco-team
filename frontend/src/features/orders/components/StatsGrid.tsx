import StatCard from "./StatCard";
import { useOrderStore } from "@/store/orderStore";
import { Skeleton } from "@/components/ui/Skeleton";
import { cart, percent, dollar, file } from "@/assets/assets.ts";
import { formatCurrency } from "@/lib/formatters";

export default function StatsGrid() {
    const { orders, totalOrders, isLoading } = useOrderStore();

    const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalVAT = orders.reduce((sum, o) => sum + o.taxAmount, 0);

    const statsData = [
        {
            title: "Total Orders",
            value: totalOrders.toLocaleString(),
            deltaText: "↑ +5.4%",
            deltaNote: "+5.41% from last period",
            icon: <img src={cart} alt="" className="size-4 opacity-70" />,
        },
        {
            title: "VAT Collected",
            value: formatCurrency(totalVAT),
            deltaText: "↑ +6.5%",
            deltaNote: "+6.51% from last period",
            icon: <img src={percent} alt="" className="size-4 opacity-70" />,
        },
        {
            title: "Total Sales",
            value: formatCurrency(totalSales),
            deltaText: "↑ +8.2%",
            deltaNote: "+8.23% from last period",
            icon: <img src={dollar} alt="" className="size-4 opacity-70" />,
        },
        {
            title: "Total Imports",
            value: "1,240",
            deltaText: "↑ +3.1%",
            deltaNote: "+3.12% from last period",
            icon: <img src={file} alt="" className="size-4 opacity-70" />,
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {isLoading 
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-xl border border-border bg-white p-3.5 shadow-sm space-y-3">
                        <div className="flex items-start justify-between">
                            <Skeleton className="size-9" />
                            <Skeleton className="h-3 w-10" />
                        </div>
                        <div className="space-y-1">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-7 w-28" />
                            <Skeleton className="h-2 w-32" />
                        </div>
                    </div>
                ))
                : statsData.map((s) => (
                    <StatCard
                        key={s.title}
                        title={s.title}
                        value={s.value}
                        deltaText={s.deltaText}
                        deltaNote={s.deltaNote}
                        icon={s.icon}
                    />
                ))
            }
        </div>
    );
}