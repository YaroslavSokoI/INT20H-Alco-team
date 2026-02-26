import type { ReactNode } from "react";
import CardFilterIcon from "@/assets/cardFilter.svg?react";

type Props = {
    title: string;
    value: string;
    deltaText: string;
    deltaNote: string;
    positive: boolean;
    icon: ReactNode;
    filterActive?: boolean;
    onFilterClick?: () => void;
};

export default function StatCard({ title, value, deltaText, deltaNote, positive, icon, filterActive = false, onFilterClick }: Props) {
    return (
        <div className="relative flex h-full flex-col rounded-xl border border-border bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
                <div className="grid size-9 place-items-center rounded-xl bg-surface text-black/70">
                    {icon}
                </div>

                <div
                    className={
                        "text-xs font-semibold leading-none " +
                        (positive ? "text-success" : "text-red-500")
                    }
                >
                    {deltaText}
                </div>
            </div>

            <div className="mt-auto pb-1">
                <div className="text-sm font-medium text-black/60">{title}</div>
                <div className="mt-1 text-2xl font-bold tracking-tight text-black">{value}</div>
                <div className="mt-0.5 text-xs text-black/40">{deltaNote}</div>
            </div>

            <button
                type="button"
                onClick={onFilterClick}
                className={
                    "absolute bottom-3 right-3 grid size-6 place-items-center rounded-md bg-white transition-colors focus:outline-none focus-visible:ring-0 " +
                    (filterActive
                        ? "border-success text-success"
                        : "border-border/70 text-black/35 hover:text-black/55")
                }
                aria-pressed={filterActive}
                aria-label="Filter"
            >
                <CardFilterIcon className="size-5" />
            </button>
        </div>
    );
}
