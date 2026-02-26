import { useState } from "react";
import OrdersTable from "@/features/orders/components/OrdersTable.tsx";
import OrdersChart from "@/features/orders/components/OrdersChart.tsx";
import { StatsGridControlled, type StatMetric } from "@/features/orders/components/StatsGrid.tsx";

const DashboardPage = () => {
    const [selectedMetric, setSelectedMetric] = useState<StatMetric | null>("sales");

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-6">
                <div className="xl:col-span-4 h-full">
                    <StatsGridControlled selectedMetric={selectedMetric} onSelectMetric={setSelectedMetric} />
                </div>
                <div className="xl:col-span-2 h-full">
                    <OrdersChart metric={selectedMetric} className="h-full" />
                </div>
            </div>
            <OrdersTable />
        </div>
    );
};

export default DashboardPage;