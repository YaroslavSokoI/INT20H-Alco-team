import { useAuthStore } from "@/store/authStore";
import logoutIcon from "@/assets/logout.svg";
import { Button } from "@/components/ui/Button.tsx";

const Topbar = () => {
    const { user, logout } = useAuthStore();

    if (!user) return null;

    return (
        <header className="bg-white px-6 py-3 border-b border-border flex justify-between items-center">
            <div className="flex-1" />

            <div className="flex items-center gap-6">
                <div className="flex gap-2.5">
                    <div className="size-9 flex items-center justify-center bg-gradient-primary text-lg text-white rounded-full">
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
                    onClick={logout}
                >
                    <img src={logoutIcon} alt="" className="size-4" />
                    <span className="font-medium">Log out</span>
                </Button>
            </div>
        </header>
    );
};

export default Topbar;