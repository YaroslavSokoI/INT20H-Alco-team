import OrdersTable from "@/features/orders/components/OrdersTable.tsx";
import StatsGrid from "@/features/orders/components/StatsGrid.tsx";

const DashboardPage = () => {
    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight">Orders Dashboard</h1>
                    <p className="mt-1 text-sm text-black/50">
                        Manage your orders, view details, and track VAT collected
                    </p>
                </div>
            </div>

            <StatsGrid />
            <OrdersTable />
        </div>
    );
};

export default DashboardPage;