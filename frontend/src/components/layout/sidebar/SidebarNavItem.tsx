import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";
import { Button, cn } from "@/components/ui/Button";

type Props = {
    to?: string;
    onClick?: () => void;
    icon: ReactNode;
    label: string;
    variant?: "default" | "danger";
};

export default function SidebarNavItem({
                                           to,
                                           onClick,
                                           icon,
                                           label,
                                           variant = "default",
                                       }: Props) {
    const base =
        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition w-full text-left";

    const danger = "text-danger hover:bg-danger/10";

    if (to) {
        return (
            <NavLink
                to={to}
                className={({ isActive }) =>
                    cn(
                        base,
                        variant === "danger" ? danger : "text-black/70 ",
                        isActive && variant !== "danger" && "bg-gradient-primary text-white shadow-sm"
                    )
                }
            >
                <span className="grid size-5 place-items-center">{icon}</span>
                <span>{label}</span>
            </NavLink>
        );
    }

    return (
        <Button
            type="button"
            variant="ghost"
            onClick={onClick}
            className={cn(base, variant === "danger" ? danger : "text-black/70", "justify-start")}
        >
            <span className="grid size-5 place-items-center">{icon}</span>
            <span>{label}</span>
        </Button>
    );
}