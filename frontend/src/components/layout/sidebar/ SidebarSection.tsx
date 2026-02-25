import type { ReactNode } from "react";

export default function SidebarSection({
                                           title,
                                           children,
                                       }: {
    title: string;
    children: ReactNode;
}) {
    return (
        <div className="space-y-2">
            <div className="px-4 text-xs font-semibold text-text-muted">{title}</div>
            <div className="space-y-1 px-2">{children}</div>
        </div>
    );
}