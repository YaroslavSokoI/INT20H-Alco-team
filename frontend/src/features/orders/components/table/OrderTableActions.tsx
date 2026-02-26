import { Button } from "@/components/ui/Button";
import { expandIcon, filterIcon, importIcon, searchIcon } from "@/assets/assets.ts";

import { useOrderStore } from "@/store/orderStore";
import { useState, useCallback, memo, useRef } from "react";

interface OrderTableActionsProps {
    onImport: (file: File) => void;
    onCreate: () => void;
}

const OrderTableActions = memo(({ onImport, onCreate }: OrderTableActionsProps) => {
    const { searchQuery, setSearchQuery, setFilters } = useOrderStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [localFilters, setLocalFilters] = useState({
        minTotal: "",
        maxTotal: "",
        fromDate: "",
        toDate: ""
    });

    const handleApplyFilters = useCallback(() => {
        setFilters({
            dateRange: localFilters.fromDate && localFilters.toDate ? { from: localFilters.fromDate, to: localFilters.toDate } : undefined,
            totalRange: localFilters.minTotal || localFilters.maxTotal ? { 
                min: parseFloat(localFilters.minTotal) || 0, 
                max: parseFloat(localFilters.maxTotal) || Infinity 
            } : undefined
        });
        setShowFilters(false);
    }, [localFilters, setFilters]);

    const handleReset = useCallback(() => {
        setLocalFilters({ minTotal: "", maxTotal: "", fromDate: "", toDate: "" });
        setFilters({});
        setSearchQuery(""); // Скидаємо також пошук
        setShowFilters(false);
    }, [setFilters, setSearchQuery]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }, [setSearchQuery]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImport(file);
            // Скидаємо значення інпуту, щоб можна було вибрати той самий файл повторно
            e.target.value = "";
        }
    };

    return (
        <div className="border-t border-border px-5 py-2.5 space-y-3">
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".csv" 
                className="hidden" 
            />
            <div className="flex items-center justify-between gap-3">
                <div className="w-full h-9 px-3 flex items-center gap-2 border border-border text-sm rounded-xl text-text-muted focus-within:ring-2 focus-within:ring-primary/10 transition-all bg-surface/50">
                    <img src={searchIcon} alt="search icon" className="size-4 opacity-40"/>
                    <input
                        placeholder="Search by ID, date or jurisdiction..."
                        className="outline-none w-full bg-transparent"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Button 
                        variant={showFilters ? "primary" : "outline"} 
                        size="md" 
                        className="gap-2 font-semibold shadow-xs" 
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <img src={filterIcon} alt="" className={`size-3.5 ${showFilters ? 'brightness-0 invert' : ''}`} />
                        Filter
                    </Button>
                    <Button 
                        variant="outline" 
                        size="md" 
                        className="gap-2 font-semibold shadow-xs" 
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <img src={importIcon} alt="" className="size-3.5" />
                        Import
                    </Button>
                    <Button 
                        size="md"
                        className="gap-2 font-semibold shadow-sm"
                        onClick={onCreate}
                    >
                        <img src={expandIcon} alt="" className="size-3.5 brightness-0 invert" />
                        Create
                    </Button>
                </div>
            </div>

            {showFilters && (
                <div className="p-6 bg-white border border-border rounded-2xl space-y-6 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-text uppercase tracking-wider">Advanced Filters</h3>
                        <button 
                            onClick={() => setShowFilters(false)}
                            className="text-text-muted hover:text-text transition-colors"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase text-text-muted flex items-center gap-1.5">
                                <span className="size-1.5 rounded-full bg-primary/40"></span>
                                Total Amount ($)
                            </label>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="number"
                                    placeholder="Min"
                                    className="h-10 px-3 border border-border rounded-xl text-sm bg-white outline-none w-full focus:ring-2 focus:ring-primary/10 transition-all"
                                    value={localFilters.minTotal}
                                    onChange={(e) => setLocalFilters({...localFilters, minTotal: e.target.value})}
                                />
                                <span className="text-border">—</span>
                                <input 
                                    type="number"
                                    placeholder="Max"
                                    className="h-10 px-3 border border-border rounded-xl text-sm bg-white outline-none w-full focus:ring-2 focus:ring-primary/10 transition-all"
                                    value={localFilters.maxTotal}
                                    onChange={(e) => setLocalFilters({...localFilters, maxTotal: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 lg:col-span-2">
                            <label className="text-[11px] font-black uppercase text-text-muted flex items-center gap-1.5">
                                <span className="size-1.5 rounded-full bg-primary/40"></span>
                                Date Range
                            </label>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="date"
                                    className="h-10 px-3 border border-border rounded-xl text-sm bg-white outline-none w-full focus:ring-2 focus:ring-primary/10 transition-all"
                                    value={localFilters.fromDate}
                                    onChange={(e) => setLocalFilters({...localFilters, fromDate: e.target.value})}
                                />
                                <span className="text-border">to</span>
                                <input 
                                    type="date"
                                    className="h-10 px-3 border border-border rounded-xl text-sm bg-white outline-none w-full focus:ring-2 focus:ring-primary/10 transition-all"
                                    value={localFilters.toDate}
                                    onChange={(e) => setLocalFilters({...localFilters, toDate: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
                        <Button 
                            variant="outline" 
                            size="md" 
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
