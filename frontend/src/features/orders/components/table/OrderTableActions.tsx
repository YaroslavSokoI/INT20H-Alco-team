import { Button } from "@/components/ui/Button";
import { expandIcon, filterIcon, importIcon, searchIcon } from "@/assets/assets.ts";

interface OrderTableActionsProps {
    onSearch: (value: string) => void;
    onFilter: () => void;
    onImport: () => void;
    onCreate: () => void;
}

export default function OrderTableActions({ onSearch, onFilter, onImport, onCreate }: OrderTableActionsProps) {
    return (
        <div className="border-t border-border px-5 py-2.5">
            <div className="flex items-center justify-between gap-3">
                <div className="w-full h-9 px-3 flex items-center gap-2 border border-border text-sm rounded-xl text-text-muted focus-within:ring-2 focus-within:ring-primary/10 transition-all bg-surface/50">
                    <img src={searchIcon} alt="search icon" className="size-4 opacity-40"/>
                    <input
                        placeholder="Search orders..."
                        className="outline-none w-full bg-transparent"
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="md" className="gap-2 font-semibold shadow-xs" onClick={onFilter}>
                        <img src={filterIcon} alt="" className="size-3.5" />
                        Filter
                    </Button>
                    <Button variant="outline" size="md" className="gap-2 font-semibold shadow-xs" onClick={onImport}>
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
        </div>
    );
}
