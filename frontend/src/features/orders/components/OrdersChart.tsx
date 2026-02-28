import { useMemo, useState, useEffect } from "react";
import type { StatMetric } from "./StatsGrid";
import { formatCurrency } from "@/lib/formatters";
import { ordersApi, type ApiOrder } from "@/api/orders";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type Period = "w" | "m" | "y";

type Props = {
    metric: StatMetric | null;
    className?: string;
};

type SeriesPoint = {
    label: string;
    value: number;
};

function formatMetricValue(metric: StatMetric, value: number): string {
    if (metric === "sales" || metric === "tax") return formatCurrency(value);
    return value.toLocaleString();
}

function CustomTooltip({
    active,
    payload,
    label,
    metric,
}: {
    active?: boolean;
    payload?: Array<{ value?: number | string }>;
    label?: string;
    metric: StatMetric;
}) {
    if (!active || !payload?.length) return null;
    const raw = payload[0]?.value;
    const value = typeof raw === "number" ? raw : Number(raw);

    return (
        <div className="rounded-lg border border-border bg-white px-3 py-2 shadow-sm">
            <div className="text-[11px] font-medium text-black/50">{label}</div>
            <div className="mt-0.5 text-sm font-semibold text-black">
                {formatMetricValue(metric, Number.isFinite(value) ? value : 0)}
            </div>
        </div>
    );
}

function startOfDay(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d: Date, days: number): Date {
    const next = new Date(d);
    next.setDate(next.getDate() + days);
    return next;
}

function formatWeekdayLabel(d: Date): string {
    // Mon. Tue. ...
    return d.toLocaleDateString("en-US", { weekday: "short" }) + ".";
}

function metricValue(metric: StatMetric, order: { subtotal: number; taxAmount: number }): number {
    switch (metric) {
        case "orders":
        case "imports":
            return 1;
        case "sales":
            return Number(order.subtotal) || 0;
        case "tax":
            return Number(order.taxAmount) || 0;
    }
}

function buildSeries(orders: Array<{ timestamp: string; subtotal: number; taxAmount: number }>, metric: StatMetric, period: Period): SeriesPoint[] {
    let now = new Date();
    if (orders.length > 0) {
        const maxTime = Math.max(...orders.map(o => new Date(o.timestamp).getTime()));
        if (!isNaN(maxTime)) {
            now = new Date(maxTime);
        }
    }

    if (period === "w") {
        const end = startOfDay(now);
        const start = addDays(end, -6);

        const buckets = Array.from({ length: 7 }).map((_, i) => {
            const day = addDays(start, i);
            return {
                day,
                label: formatWeekdayLabel(day),
                value: 0,
            };
        });

        for (const o of orders) {
            const d = startOfDay(new Date(o.timestamp));
            const idx = Math.floor((d.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
            if (idx >= 0 && idx < 7) {
                buckets[idx].value += metricValue(metric, o);
            }
        }

        return buckets.map(({ label, value }) => ({ label, value }));
    }

    if (period === "m") {
        // 4 weeks (W1..W4)
        const end = startOfDay(now);
        const start = addDays(end, -27);

        const buckets: SeriesPoint[] = [
            { label: "W1", value: 0 },
            { label: "W2", value: 0 },
            { label: "W3", value: 0 },
            { label: "W4", value: 0 },
        ];

        for (const o of orders) {
            const d = startOfDay(new Date(o.timestamp));
            const diffDays = Math.floor((d.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
            if (diffDays >= 0 && diffDays < 28) {
                const idx = Math.min(3, Math.floor(diffDays / 7));
                buckets[idx].value += metricValue(metric, o);
            }
        }

        return buckets;
    }

    const year = now.getFullYear();
    const buckets = Array.from({ length: 12 }).map((_, m) => {
        const d = new Date(year, m, 1);
        const label = d.toLocaleDateString("en-US", { month: "short" });
        return { label, value: 0 };
    });

    for (const o of orders) {
        const d = new Date(o.timestamp);
        if (d.getFullYear() !== year) continue;
        buckets[d.getMonth()].value += metricValue(metric, o);
    }

    return buckets;
}

export default function OrdersChart({ metric, className }: Props) {
    const [period, setPeriod] = useState<Period>("w");
    const [chartOrders, setChartOrders] = useState<ApiOrder[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const resolvedMetric: StatMetric = metric ?? "sales";

    useEffect(() => {
        let mounted = true;
        setIsLoading(true);

        const fetchChartData = async () => {
            try {
                const response = await ordersApi.getOrders(1, 10000, {
                    importId: 'latest',
                });

                if (mounted) {
                    setChartOrders(response.data);
                }
            } catch (err) {
                console.error("Failed to fetch chart data", err);
            } finally {
                if (mounted) setIsLoading(false);
            }
        };

        fetchChartData();

        return () => {
            mounted = false;
        };
    }, [period]);

    const series = useMemo(() => buildSeries(chartOrders, resolvedMetric, period), [chartOrders, resolvedMetric, period]);

    const data = series.length ? series : [{ label: "", value: 0 }];

    return (
        <div className={"rounded-xl border border-border bg-white p-4 shadow-sm flex flex-col " + (className ?? "")}>
            <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-black/60">
                    {resolvedMetric === "orders" && "Orders"}
                    {resolvedMetric === "imports" && "Imports"}
                    {resolvedMetric === "sales" && "Sales"}
                    {resolvedMetric === "tax" && "Tax"}
                </div>

                <div className="inline-flex items-center rounded-md border border-border bg-surface p-0.5">
                    {(["w", "m", "y"] as const).map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => setPeriod(p)}
                            className={
                                "px-2.5 py-1 text-xs font-semibold uppercase rounded-[6px] transition-colors focus:outline-none focus-visible:ring-0 " +
                                (period === p ? "bg-white text-success shadow-xs" : "text-black/50 hover:text-black/70")
                            }
                            aria-pressed={period === p}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            <div className={`mt-3 flex min-h-[90px] transition-opacity duration-200 ${isLoading ? "opacity-30 pointer-events-none" : ""}`}>
                <div
                    className="h-full w-full select-none"
                    onMouseDown={(e) => {
                        e.preventDefault();
                    }}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 6, right: 8, bottom: 0, left: 8 }}>
                            <defs>
                                <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="rgb(34 197 94)" stopOpacity={0.28} />
                                    <stop offset="100%" stopColor="rgb(34 197 94)" stopOpacity={0.06} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.06)" />
                            <XAxis
                                dataKey="label"
                                tick={{ fontSize: 11, fill: "rgba(0,0,0,0.35)" }}
                                tickLine={false}
                                axisLine={false}
                                interval={0}
                                padding={{ left: 16, right: 16 }}
                            />
                            <YAxis hide domain={["auto", "auto"]} />

                            <Tooltip
                                isAnimationActive={false}
                                cursor={{ stroke: "rgba(34,197,94,0.35)", strokeWidth: 2 }}
                                content={<CustomTooltip metric={resolvedMetric} />}
                                wrapperStyle={{ outline: "none" }}
                            />

                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="rgb(34 197 94)"
                                strokeWidth={3}
                                fill="url(#chartFill)"
                                dot={false}
                                activeDot={{ r: 4, fill: "rgb(34 197 94)", stroke: "white", strokeWidth: 2 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
