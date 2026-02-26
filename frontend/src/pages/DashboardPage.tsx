import OrdersTable from "@/features/orders/components/OrdersTable.tsx";
import StatsGrid from "@/features/orders/components/StatsGrid.tsx";

const DashboardPage = () => {
    return (
        <div className="space-y-5">
            <StatsGrid />
            <OrdersTable />
        </div>
    );
};

export default DashboardPage;