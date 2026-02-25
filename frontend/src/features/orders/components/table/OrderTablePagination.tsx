import { Button, cn } from "@/components/ui/Button";
import { arrowRight } from "@/assets/assets.ts";

interface OrderTablePaginationProps {
    currentPage: number;
    pageSize: number;
    totalOrders: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function OrderTablePagination({ 
    currentPage, 
    pageSize, 
    totalOrders, 
    totalPages, 
    onPageChange 
}: OrderTablePaginationProps) {
    const startRange = (currentPage - 1) * pageSize + 1;
    const endRange = Math.min(currentPage * pageSize, totalOrders);

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3 text-[11px] text-text-muted">
            <div>Rows per page: {pageSize}</div>

            <div className="flex items-center gap-2">
                <div>{totalOrders > 0 ? `${startRange}–${endRange} of ${totalOrders.toLocaleString()}` : "0-0 of 0"}</div>
                <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                        const pageNumber = i + 1;
                        return (
                            <Button
                                key={pageNumber}
                                variant={currentPage === pageNumber ? "primary" : "outline"}
                                size="icon"
                                className={cn("size-7 font-medium", currentPage === pageNumber && "text-white")}
                                onClick={() => onPageChange(pageNumber)}
                            >
                                {pageNumber}
                            </Button>
                        );
                    })}
                    
                    {totalPages > 5 && currentPage < totalPages && (
                         <Button 
                            variant="outline" 
                            size="icon" 
                            className="size-7 bg-white hover:bg-black/5 border-border shadow-xs"
                            onClick={() => onPageChange(currentPage + 1)}
                        >
                            <img src={arrowRight} alt="chevron right" className="size-3 opacity-60"/>
                        </Button>
                    )}
                    
                    {totalPages <= 5 && totalPages > 0 && (
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className="size-7 bg-white hover:bg-black/5 border-border shadow-xs"
                            disabled={currentPage === totalPages}
                            onClick={() => onPageChange(currentPage + 1)}
                        >
                            <img src={arrowRight} alt="chevron right" className="size-3 opacity-60"/>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
