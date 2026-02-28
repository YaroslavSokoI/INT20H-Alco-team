import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";
import { Button, cn } from "@/components/ui/Button";

type Props = {
    to?: string;
    onClick?: () => void;
    icon: ReactNode;
    label: string;
    variant?: "default" | "danger";
    collapsed?: boolean;
};

export default function SidebarNavItem({
    to,
    onClick,
    icon,
    label,
    variant = "default",
    collapsed = false,
}: Props) {
    const base =
        "flex items-center rounded-xl py-3 text-sm font-medium transition-all duration-500 w-full text-left overflow-hidden";

    const danger = "text-danger hover:bg-danger/10";

    const content = (
        <>
            <span className="grid size-5 shrink-0 place-items-center">{icon}</span>
            <span
                className={cn(
                    "whitespace-nowrap overflow-hidden transition-all duration-500",
                    collapsed ? "opacity-0 max-w-0 ml-0" : "opacity-100 max-w-[200px] ml-3"
                )}
            >
                {label}
            </span>
        </>
    );

    if (to) {
        return (
            <NavLink
                to={to}
                title={collapsed ? label : undefined}
                className={({ isActive }) =>
                    cn(
                        base,
                        variant === "danger" ? danger : "text-black/70 ",
                        isActive && variant !== "danger" && "bg-gradient-primary text-white shadow-sm",
                        collapsed ? "px-[22px]" : "px-4"
                    )
                }
            >
                {content}
            </NavLink>
        );
    }

    return (
        <Button
            type="button"
            variant="ghost"
            onClick={onClick}
            title={collapsed ? label : undefined}
            className={cn(
                base,
                variant === "danger" ? danger : "text-black/70",
                collapsed ? "px-[22px]" : "px-4"
            )}
        >
            {content}
        </Button>
    );
}