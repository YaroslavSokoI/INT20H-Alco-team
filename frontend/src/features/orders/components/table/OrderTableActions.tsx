import { Button } from "@/components/ui/Button";
import { expandIcon, filterIcon, importIcon, searchIcon, refreshIcon } from "@/assets/assets.ts";

import { useOrderStore } from "@/store/orderStore";
import { useState, useCallback, memo } from "react";

interface OrderTableActionsProps {
    onImport: () => void;
    onCreate: () => void;
}

interface LocalFilters {
    county: string;
    city: string;
    fromDate: string;
    toDate: string;
    subtotalMin: string;
    subtotalMax: string;
    taxRateMin: string;
    taxRateMax: string;
    taxMin: string;
    taxMax: string;
    totalMin: string;
    totalMax: string;
}

const EMPTY_FILTERS: LocalFilters = {
    county: "", city: "", fromDate: "", toDate: "",
    subtotalMin: "", subtotalMax: "",
    taxRateMin: "", taxRateMax: "",
    taxMin: "", taxMax: "",
    totalMin: "", totalMax: "",
};

const labelClass = "text-[11px] font-black uppercase text-text-muted flex items-center gap-1.5";
const inputClass = "h-10 px-3 border border-border rounded-xl text-sm bg-white outline-none w-full focus:ring-2 focus:ring-primary/10 transition-all";
const dot = <span className="size-1.5 rounded-full bg-primary/40" />;

function RangeInput({
    label,
    minVal, maxVal,
    onMinChange, onMaxChange,
    placeholder = ["Min", "Max"],
    type = "number",
}: {
    label: string;
    minVal: string; maxVal: string;
    onMinChange: (v: string) => void; onMaxChange: (v: string) => void;
    placeholder?: [string, string];
    type?: string;
}) {
    return (
        <div className="space-y-2">
            <label className={labelClass}>{dot}{label}</label>
            <div className="flex items-center gap-2">
                <input
                    type={type}
                    placeholder={placeholder[0]}
                    className={inputClass}
                    value={minVal}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onMinChange(e.target.value)}
                />
                <span className="text-border shrink-0">—</span>
                <input
                    type={type}
                    placeholder={placeholder[1]}
                    className={inputClass}
                    value={maxVal}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onMaxChange(e.target.value)}
                />
            </div>
        </div>
    );
}

const OrderTableActions = memo(({ onImport, onCreate }: OrderTableActionsProps) => {
    const { searchQuery, setSearchQuery, setFilters, filters, fetchOrders, isLoading } = useOrderStore();
    const [showFilters, setShowFilters] = useState(false);
    const [local, setLocal] = useState<LocalFilters>({
        county: filters.county ?? "",
        city: filters.city ?? "",
        fromDate: filters.dateFrom ?? "",
        toDate: filters.dateTo ?? "",
        subtotalMin: filters.subtotalMin !== undefined ? String(filters.subtotalMin) : "",
        subtotalMax: filters.subtotalMax !== undefined ? String(filters.subtotalMax) : "",
        taxRateMin: filters.taxRateMin !== undefined ? String(filters.taxRateMin) : "",
        taxRateMax: filters.taxRateMax !== undefined ? String(filters.taxRateMax) : "",
        taxMin: filters.taxMin !== undefined ? String(filters.taxMin) : "",
        taxMax: filters.taxMax !== undefined ? String(filters.taxMax) : "",
        totalMin: filters.totalMin !== undefined ? String(filters.totalMin) : "",
        totalMax: filters.totalMax !== undefined ? String(filters.totalMax) : "",
    });

    const set = (patch: Partial<LocalFilters>) => setLocal(prev => ({ ...prev, ...patch }));

    const toNum = (v: string) => v.trim() !== "" ? parseFloat(v) : undefined;

    const handleApplyFilters = useCallback(() => {
        setFilters({
            county: local.county.trim() || undefined,
            city: local.city.trim() || undefined,
            dateFrom: local.fromDate || undefined,
            dateTo: local.toDate || undefined,
            subtotalMin: toNum(local.subtotalMin),
            subtotalMax: toNum(local.subtotalMax),
            taxRateMin: toNum(local.taxRateMin),
            taxRateMax: toNum(local.taxRateMax),
            taxMin: toNum(local.taxMin),
            taxMax: toNum(local.taxMax),
            totalMin: toNum(local.totalMin),
            totalMax: toNum(local.totalMax),
        });
        setShowFilters(false);
    }, [local, setFilters]);

    const handleReset = useCallback(() => {
        setLocal(EMPTY_FILTERS);
        setFilters({});
        setSearchQuery("");
        setShowFilters(false);
    }, [setFilters, setSearchQuery]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }, [setSearchQuery]);

    const activeFilterCount = [
        filters.county, filters.city, filters.dateFrom, filters.dateTo,
        filters.subtotalMin, filters.subtotalMax,
        filters.taxRateMin, filters.taxRateMax,
        filters.taxMin, filters.taxMax,
        filters.totalMin, filters.totalMax,
    ].filter(v => v !== undefined && v !== "").length;

    return (
        <div className="border-t border-border px-5 py-2.5 space-y-3">
            <div className="flex items-center justify-between gap-3">
                <div className="w-full h-9 px-3 flex items-center gap-2 border border-border text-sm rounded-xl text-text-muted focus-within:ring-2 focus-within:ring-primary/10 transition-all bg-surface/50">
                    <img src={searchIcon} alt="search icon" className="size-4 opacity-40" />
                    <input
                        placeholder="Search by ID, date or jurisdiction..."
                        className="outline-none w-full bg-transparent"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="md"
                        className="shadow-xs"
                        onClick={() => fetchOrders()}
                        disabled={isLoading}
                    >
                        <img src={refreshIcon} alt="refresh" className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
                    </Button>
                    <Button
                        variant={showFilters ? "primary" : "outline"}
                        size="md"
                        className="gap-2 font-semibold shadow-xs relative"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <img src={filterIcon} alt="" className={`size-3.5 ${showFilters ? "brightness-0 invert" : ""}`} />
                        Filter
                        {activeFilterCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 size-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                                {activeFilterCount}
                            </span>
                        )}
                    </Button>
                    <Button 
                        variant="outline" 
                        size="md" 
                        className="gap-2 font-semibold shadow-xs" 
                        onClick={onImport}
                    >
                        <img src={importIcon} alt="" className="size-3.5" />
                        Import
                    </Button>
                    <Button size="md" className="gap-2 font-semibold shadow-sm" onClick={onCreate}>
                        <img src={expandIcon} alt="" className="size-3.5 brightness-0 invert" />
                        Create
                    </Button>
                </div>
            </div>

            {showFilters && (
                <div className="p-6 bg-white border border-border rounded-2xl space-y-6 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-text uppercase tracking-wider">Advanced Filters</h3>
                        <button onClick={() => setShowFilters(false)} className="text-text-muted hover:text-text transition-colors">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Row 1: County, City, Date Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className={labelClass}>{dot}County</label>
                            <input
                                type="text"
                                placeholder="e.g. Kings"
                                className={inputClass}
                                value={local.county}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => set({ county: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className={labelClass}>{dot}City</label>
                            <input
                                type="text"
                                placeholder="e.g. Brooklyn"
                                className={inputClass}
                                value={local.city}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => set({ city: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2 lg:col-span-2">
                            <label className={labelClass}>{dot}Date Range</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="date"
                                    className={inputClass}
                                    value={local.fromDate}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => set({ fromDate: e.target.value })}
                                />
                                <span className="text-border shrink-0">to</span>
                                <input
                                    type="date"
                                    className={inputClass}
                                    value={local.toDate}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => set({ toDate: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Numeric ranges */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <RangeInput
                            label="Subtotal ($)"
                            minVal={local.subtotalMin} maxVal={local.subtotalMax}
                            onMinChange={v => set({ subtotalMin: v })}
                            onMaxChange={v => set({ subtotalMax: v })}
                        />
                        <RangeInput
                            label="Tax Rate"
                            minVal={local.taxRateMin} maxVal={local.taxRateMax}
                            onMinChange={v => set({ taxRateMin: v })}
                            onMaxChange={v => set({ taxRateMax: v })}
                            placeholder={["0.00", "1.00"]}
                        />
                        <RangeInput
                            label="Tax ($)"
                            minVal={local.taxMin} maxVal={local.taxMax}
                            onMinChange={v => set({ taxMin: v })}
                            onMaxChange={v => set({ taxMax: v })}
                        />
                        <RangeInput
                            label="Total ($)"
                            minVal={local.totalMin} maxVal={local.totalMax}
                            onMinChange={v => set({ totalMin: v })}
                            onMaxChange={v => set({ totalMax: v })}
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
                        <Button
                            variant="outline" size="md"
                            className="h-10 rounded-xl px-6 text-xs font-bold"
                            onClick={handleReset}
                        >
                            Reset
                        </Button>
                        <Button
                            size="md"
                            className="h-10 rounded-xl px-8 text-xs font-bold shadow-lg shadow-primary/20"
                            onClick={handleApplyFilters}
                        >
                            Apply Filters
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
});

export default OrderTableActions;
