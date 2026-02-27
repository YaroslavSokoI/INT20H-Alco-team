import StatCard from "./StatCard";
import { useOrderStore } from "@/store/orderStore";
import { Skeleton } from "@/components/ui/Skeleton";
import { cart, percent, dollar, file } from "@/assets/assets.ts";
import { formatCurrency } from "@/lib/formatters";
import type { ReactNode } from "react";

export type StatMetric = "orders" | "tax" | "sales" | "imports";

function formatDelta(delta: number): string {
    const sign = delta >= 0 ? "↑ +" : "↓ ";
    return `${sign}${Math.abs(delta)}%`;
}

function formatDeltaNote(): string {
    return `compared to previous 30 days`;
}

export default function StatsGrid() {
    // Контроль вибраного фільтра піднімаємо вище (DashboardPage), щоб графік міг залежати від нього.
    // Тут залишаємо backward-compatible дефолтний рендер.

    return <StatsGridControlled />;
}

type ControlledProps = {
    selectedMetric?: StatMetric | null;
    onSelectMetric?: (metric: StatMetric | null) => void;
};

export function StatsGridControlled({ selectedMetric = null, onSelectMetric }: ControlledProps) {
    const { totalOrders, stats, isLoading } = useOrderStore();

    const statsData: Array<{
        metric: StatMetric;
        title: string;
        value: string;
        deltaText: string;
        deltaNote: string;
        positive: boolean;
        icon: ReactNode;
    }> = [
        {
            metric: "orders",
            title: "Total Orders",
            value: (stats.totalOrders || totalOrders).toLocaleString(),
            deltaText: formatDelta(stats.deltaOrders),
            deltaNote: formatDeltaNote(),
            positive: stats.deltaOrders >= 0,
            icon: <img src={cart} alt="" className="size-4 opacity-70" />,
        },
        {
            metric: "tax",
            title: "VAT Collected",
            value: formatCurrency(stats.totalTax || 0),
            deltaText: formatDelta(stats.deltaTax),
            deltaNote: formatDeltaNote(),
            positive: stats.deltaTax >= 0,
            icon: <img src={percent} alt="" className="size-4 opacity-70" />,
        },
        {
            metric: "sales",
            title: "Total Sales",
            value: formatCurrency(stats.totalSales || 0),
            deltaText: formatDelta(stats.deltaSales),
            deltaNote: formatDeltaNote(),
            positive: stats.deltaSales >= 0,
            icon: <img src={dollar} alt="" className="size-4 opacity-70" />,
        },
        {
            metric: "imports",
            title: "Total Imports",
            value: (stats.totalOrders || totalOrders).toLocaleString(),
            deltaText: formatDelta(stats.deltaOrders),
            deltaNote: formatDeltaNote(),
            positive: stats.deltaOrders >= 0,
            icon: <img src={file} alt="" className="size-4 opacity-70" />,
        },
    ];

    return (
        <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 xl:auto-rows-fr items-stretch">
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
                        positive={s.positive}
                        icon={s.icon}
                        filterActive={selectedMetric === s.metric}
                        onFilterClick={() => {
                            if (!onSelectMetric) return;
                            onSelectMetric(selectedMetric === s.metric ? null : s.metric);
                        }}
                    />
                ))
            }
        </div>
    );
}
