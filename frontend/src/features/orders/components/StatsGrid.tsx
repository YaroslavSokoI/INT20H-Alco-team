import StatCard from "./StatCard";
import { stats } from "../mock";

export default function StatsGrid() {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((s) => (
                <StatCard
                    key={s.title}
                    title={s.title}
                    value={s.value}
                    deltaText={s.deltaText}
                    deltaNote={s.deltaNote}
                    icon={s.icon}
                />
            ))}
        </div>
    );
}