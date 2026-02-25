import SidebarNavItem from "@/components/layout/sidebar/SidebarNavItem.tsx";
import SidebarSection from "@/components/layout/sidebar/ SidebarSection.tsx";

import DashboardIcon from "@/assets/dashboard.svg?react"
import OrdersIcon from "@/assets/orders.svg?react"
import ReportsIcon from "@/assets/reports.svg?react"
import SettingsIcon from "@/assets/settings.svg?react"
import logout from "@/assets/logout.svg"
import { Link } from "@/components/ui/Link";

const Sidebar = () => {
    return (
        <div className="bg-white md:min-w-52 border-r border-border flex flex-col">
            <div className="px-4 py-4">
                <Link to="/" className="flex gap-1.5 items-center justify-start">
                    <img src="/logo.svg" alt="logo" className="w-8 h-8"/>
                    <h1 className="font-semibold text-xl">Alko<span className="text-primary">DOLIV</span></h1>
                </Link>
            </div>

            <div className="w-32 block self-center">
                <div className="h-px bg-border" />
            </div>

            <div className="space-y-6 py-2">
                <SidebarSection title="Menu">
                    <SidebarNavItem to="/" icon={<DashboardIcon className="size-5" />} label="Dashboard" />
                    <SidebarNavItem to="/orders" icon={<OrdersIcon className="size-5"/>} label="Orders" />
                </SidebarSection>

                <SidebarSection title="System">
                    <SidebarNavItem to="/reports" icon={<ReportsIcon className="size-5"/>} label="Reports" />
                    <SidebarNavItem to="/settings" icon={<SettingsIcon className="size-5"/>} label="Settings" />

                    <SidebarNavItem
                        icon={<img src={logout} alt=""/>}
                        label="Log out"
                        variant="danger"
                        onClick={() => console.log("logout")}
                    />
                </SidebarSection>
            </div>

        </div>
    );
};

export default Sidebar;