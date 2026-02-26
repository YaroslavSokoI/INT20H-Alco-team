import type { ReactNode } from "react";

type Props = {
    title: string;
    value: string;
    deltaText: string;
    deltaNote: string;
    positive: boolean;
    icon: ReactNode;
};

export default function StatCard({ title, value, deltaText, deltaNote, positive, icon }: Props) {
    return (
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
                <div className="grid size-9 place-items-center rounded-xl bg-surface border border-border/50 text-black/70 shadow-xs">
                    {icon}
                </div>

                <div className={`text-xs font-bold uppercase px-1.5 py-0.5 rounded-md border ${
                    positive
                        ? "text-success bg-success/5 border-success/10"
                        : "text-red-500 bg-red-50 border-red-100"
                }`}>{deltaText}</div>
            </div>

            <div className="mt-3 text-sm font-medium text-black/60">{title}</div>
            <div className="mt-1 text-2xl font-bold tracking-tight">{value}</div>
            <div className="mt-0.5 text-xs text-black/40">{deltaNote}</div>
        </div>
    );
}
