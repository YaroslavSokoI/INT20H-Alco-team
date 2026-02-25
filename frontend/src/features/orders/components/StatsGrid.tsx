import StatCard from "./StatCard";
import { stats } from "../mock";
import { useOrderStore } from "@/store/orderStore";
import { Skeleton } from "@/components/ui/Skeleton";

export default function StatsGrid() {
    const { isLoading } = useOrderStore();

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
                : stats.map((s) => (
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