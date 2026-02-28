import SidebarNavItem from "@/components/layout/sidebar/SidebarNavItem.tsx";

import DashboardIcon from "@/assets/dashboard.svg?react"
import UserIcon from "@/assets/user.svg?react"
import LogoIcon from "@/assets/logo.svg?react"
import { Link } from "@/components/ui/Link";
import { useState } from "react";
import { cn } from "@/components/ui/Button.tsx";

const Sidebar = () => {
    const [isHovered, setIsHovered] = useState(false);
    const collapsed: boolean = !isHovered;

    return (
        <div
            className={cn(
                "bg-white border-r border-border flex flex-col transition-all duration-500 ease-in-out h-screen sticky top-0 z-20 overflow-y-auto overflow-x-hidden",
                collapsed ? "w-20" : "w-52"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="px-3.5 py-4 shrink-0 overflow-hidden flex justify-center">
                <Link to="/" className="relative flex items-center justify-center h-8 w-full min-w-8">
                    <div
                        className={cn(
                            "absolute transition-all duration-500 flex items-center justify-center",
                            collapsed ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
                        )}
                    >
                        <LogoIcon className="w-auto h-5" />
                    </div>

                    <div
                        className={cn(
                            "absolute transition-all duration-500 flex items-center justify-center",
                            collapsed ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100"
                        )}
                    >
                        <h1 className="font-semibold text-xl whitespace-nowrap">Alko<span className="text-primary">DOLIV</span></h1>
                    </div>
                </Link>
            </div>

            <div className={cn("block self-center shrink-0 transition-all duration-500", collapsed ? "w-12" : "w-24")}>
                <div className="h-px bg-border" />
            </div>

            <div className="space-y-6 py-2 flex-1">
                <div className="space-y-1 px-2">
                    <SidebarNavItem to="/" icon={<DashboardIcon className="size-5" />} label="Dashboard" collapsed={collapsed} />
                    <SidebarNavItem to="/users" icon={<UserIcon className="size-5" />} label="Users" collapsed={collapsed} />
                </div>
            </div>

        </div>
    );
};

export default Sidebar;