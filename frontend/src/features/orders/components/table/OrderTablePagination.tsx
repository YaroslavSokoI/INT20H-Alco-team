import { Button, cn } from "@/components/ui/Button";
import { arrowRight } from "@/assets/assets.ts";
import { useState, useEffect, useMemo, memo } from "react";

interface OrderTablePaginationProps {
    currentPage: number;
    pageSize: number;
    totalOrders: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const OrderTablePagination = memo(({ 
    currentPage, 
    pageSize, 
    totalOrders, 
    totalPages, 
    onPageChange 
}: OrderTablePaginationProps) => {
    const [inputValue, setInputValue] = useState(currentPage.toString());

    useEffect(() => {
        setInputValue(currentPage.toString());
    }, [currentPage]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const pageNumber = parseInt(inputValue);
            if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= totalPages) {
                onPageChange(pageNumber);
            } else {
                setInputValue(currentPage.toString());
            }
        }
    };

    const handleInputBlur = () => {
        const pageNumber = parseInt(inputValue);
        if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= totalPages) {
            onPageChange(pageNumber);
        } else {
            setInputValue(currentPage.toString());
        }
    };

    const startRange = (currentPage - 1) * pageSize + 1;
    const endRange = Math.min(currentPage * pageSize, totalOrders);

    const pageNumbers = useMemo(() => {
        const pages = [];
        const delta = 1; // Кількість сторінок навколо поточної

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 || // Перша сторінка
                i === totalPages || // Остання сторінка
                (i >= currentPage - delta && i <= currentPage + delta) // Навколо поточної
            ) {
                pages.push(i);
            } else if (
                (i === currentPage - delta - 1 && i > 1) ||
                (i === currentPage + delta + 1 && i < totalPages)
            ) {
                pages.push("...");
            }
        }

        // Видаляємо дублікати "..."
        return pages.filter((item, index) => pages.indexOf(item) === index);
    }, [currentPage, totalPages]);

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3 text-[11px] text-text-muted">
            <div className="flex items-center gap-4">
                <div>Rows per page: {pageSize}</div>
                <div className="flex items-center gap-1.5">
                    <span>Page</span>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        onBlur={handleInputBlur}
                        className="w-10 h-7 text-center border border-border rounded-lg bg-white outline-none focus:ring-1 focus:ring-primary/20 transition-all font-medium text-text"
                    />
                    <span>of {totalPages}</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div>{totalOrders > 0 ? `${startRange}–${endRange} of ${totalOrders.toLocaleString()}` : "0-0 of 0"}</div>
                <div className="flex items-center gap-1">
                    <Button 
                        variant="outline" 
                        size="icon" 
                        className="size-7 bg-white hover:bg-black/5 border-border shadow-xs rotate-180"
                        disabled={currentPage === 1}
                        onClick={() => onPageChange(currentPage - 1)}
                    >
                        <img src={arrowRight} alt="previous page" className="size-3 opacity-60"/>
                    </Button>

                    <div className="flex items-center gap-1 mx-1">
                        {pageNumbers.map((page, i) => {
                            if (page === "...") {
                                return <span key={`dots-${i}`} className="px-1 opacity-40">...</span>;
                            }

                            const pageNumber = page as number;
                            return (
                                <Button
                                    key={pageNumber}
                                    variant={currentPage === pageNumber ? "primary" : "outline"}
                                    size="icon"
                                    className={cn("size-7 font-medium transition-all", currentPage === pageNumber && "text-white shadow-sm shadow-primary/20")}
                                    onClick={() => onPageChange(pageNumber)}
                                >
                                    {pageNumber}
                                </Button>
                            );
                        })}
                    </div>
                    
                    <Button 
                        variant="outline" 
                        size="icon" 
                        className="size-7 bg-white hover:bg-black/5 border-border shadow-xs"
                        disabled={currentPage === totalPages || totalPages === 0}
                        onClick={() => onPageChange(currentPage + 1)}
                    >
                        <img src={arrowRight} alt="next page" className="size-3 opacity-60"/>
                    </Button>
                </div>
            </div>
        </div>
    );
});

export default OrderTablePagination;
