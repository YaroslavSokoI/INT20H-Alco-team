import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import logoutIcon from "@/assets/logout.svg";
import { Button } from "@/components/ui/Button.tsx";
import LogoutConfirmModal from "@/components/LogoutConfirmModal";

const Topbar = () => {
    const { user, logout } = useAuthStore();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    if (!user) return null;

    return (
        <>
            <header className="bg-white px-6 py-3 border-b border-border flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight flex-1">Orders Dashboard</h1>

                <div className="flex items-center gap-6">
                    <div className="flex gap-2.5">
                        <div className="size-9 flex items-center justify-center bg-gradient-primary text-lg leading-none text-white rounded-full">
                            {user.login[0]}
                        </div>
                        <div className="flex flex-col justify-center gap-0">
                            <h3 className="font-semibold text-sm">{user.login}</h3>
                            <p className="text-[12px] text-text-muted leading-tight">{user.role}</p>
                        </div>
                    </div>

                    <div className="h-8 w-px bg-border" />

                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 text-text-muted hover:text-danger transition-colors"
                        onClick={() => setShowLogoutModal(true)}
                    >
                        <img src={logoutIcon} alt="" className="size-4" />
                        <span className="font-medium">Log out</span>
                    </Button>
                </div>
            </header>

            <LogoutConfirmModal
                open={showLogoutModal}
                onConfirm={logout}
                onCancel={() => setShowLogoutModal(false)}
            />
        </>
    );
};

export default Topbar;
