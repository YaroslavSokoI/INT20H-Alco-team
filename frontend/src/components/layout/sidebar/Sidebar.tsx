import SidebarNavItem from "@/components/layout/sidebar/SidebarNavItem.tsx";

import DashboardIcon from "@/assets/dashboard.svg?react"
import UserIcon from "@/assets/user.svg?react"
import { Link } from "@/components/ui/Link";
import {useState} from "react";
import {cn} from "@/components/ui/Button.tsx";

const Sidebar = () => {
    const [isHovered, setIsHovered] = useState(false);
    const collapsed : boolean = !isHovered;

    return (
        <div
            className={cn(
                "bg-white border-r border-border flex flex-col transition-all duration-500 ease-in-out h-screen sticky top-0 z-20 overflow-y-auto overflow-x-hidden",
                collapsed ? "w-20" : "w-52"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="px-3.5 py-4 shrink-0 overflow-hidden">
                <Link to="/" className={cn("flex items-center", collapsed ? "justify-center" : "justify-center min-w-[150px]")}>
                    {collapsed ? (
                        <div className="size-7 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
                            A
                        </div>
                    ) : (
                        <h1 className="font-semibold text-xl whitespace-nowrap">Alko<span className="text-primary">DOLIV</span></h1>
                    )}
                </Link>
            </div>

            <div className={cn(" block self-center shrink-0", collapsed ? "w-12" : "w-24")}>
                <div className="h-px bg-border" />
            </div>

            <div className="space-y-6 py-2 flex-1">
                <div className="space-y-1 px-2">
                    <SidebarNavItem to="/" icon={<DashboardIcon className="size-5" />} label="Dashboard" collapsed={collapsed} />
                    <SidebarNavItem to="/users" icon={<UserIcon className="size-5"/>} label="Users" collapsed={collapsed} />
                </div>
            </div>

        </div>
    );
};

export default Sidebar;