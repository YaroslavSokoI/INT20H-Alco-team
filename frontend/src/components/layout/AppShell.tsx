import { Outlet } from "react-router-dom";
import Topbar from "@/components/layout/Topbar.tsx";
import Sidebar from "@/components/layout/sidebar/Sidebar.tsx";


export default function AppShell() {
    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <div className="flex flex-1 flex-col min-w-0 overflow-x-hidden">
                <Topbar />

                <main className="flex-1 bg-surface p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}