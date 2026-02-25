import type { ReactNode } from "react";

type Props = {
    title: string;
    value: string;
    deltaText: string;
    deltaNote: string;
    icon: ReactNode;
};

export default function StatCard({ title, value, deltaText, deltaNote, icon }: Props) {
    return (
        <div className="rounded-xl border border-border bg-white p-3.5 shadow-sm">
            <div className="flex items-start justify-between">
                <div className="grid size-9 place-items-center rounded-xl bg-surface border border-border/50 text-black/70 shadow-xs">
                    {icon}
                </div>

                <div className="text-[11px] font-bold text-success uppercase bg-success/5 px-1.5 py-0.5 rounded-md border border-success/10">{deltaText}</div>
            </div>

            <div className="mt-3 text-xs font-medium text-black/60">{title}</div>
            <div className="mt-1 text-xl font-bold tracking-tight">{value}</div>
            <div className="mt-0.5 text-[10px] text-black/40">{deltaNote}</div>
        </div>
    );
}