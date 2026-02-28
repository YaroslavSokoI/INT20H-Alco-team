import { type FormEvent, useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import type { User } from "@/types/user";

interface UserEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
}

export default function UserEditModal({ isOpen, onClose, user }: UserEditModalProps) {
    const { user: currentUser, updateSelf, updateUser } = useAuthStore();
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isSelf = !!currentUser && !!user && String(currentUser.id) === String(user.id);

    useEffect(() => {
        if (user) {
            setLogin(user.login);
            setPassword("");
            setConfirmPassword("");
            setError(null);
        }
    }, [user, isOpen]);

    if (!isOpen || !user) return null;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        const updates: { login?: string; password?: string; currentPassword?: string } = {};
        if (login !== user.login) {
            updates.login = login;
        }
        if (!confirmPassword) {
            setError(isSelf ? "Please enter your current password" : "Please enter your admin password");
            return;
        }
        updates.currentPassword = confirmPassword;

        if (password) {
            if (password.length < 6) {
                setError("Password must be at least 6 characters");
                return;
            }
            updates.password = password;
        }

        if (Object.keys(updates).length === 0) {
            onClose();
            return;
        }

        setIsLoading(true);
        try {
            if (isSelf) {
                await updateSelf(updates);
            } else {
                await updateUser(user.id, updates);
            }
            onClose();
        } catch (err: any) {
            const message = err.response?.data?.error || err.response?.data?.message || "Failed to update user";
            setError(message);
            console.error("Failed to update user", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Login
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full rounded-lg border border-border px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            placeholder="Enter new login"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {isSelf ? "Current Password" : "Admin Password"}
                        </label>
                        <input
                            type="password"
                            autoComplete="new-password"
                            className="w-full rounded-lg border border-border px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder={isSelf ? "Enter your current password" : "Enter your admin password"}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Password <span className="text-gray-400 font-normal">(leave blank to keep current)</span>
                        </label>
                        <input
                            type="password"
                            autoComplete="new-password"
                            className="w-full rounded-lg border border-border px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password"
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={isLoading}>
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
