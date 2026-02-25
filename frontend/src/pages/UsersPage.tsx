import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import UserModal from "./UserModal";
import { createIcon } from "@/assets/assets.ts";
import { Skeleton } from "@/components/ui/Skeleton";

export default function UsersPage() {
    const { users, fetchUsers } = useAuthStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUsers = async () => {
            setIsLoading(true);
            await fetchUsers();
            setIsLoading(false);
        };
        loadUsers();
    }, [fetchUsers]);

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight">Users Management</h1>
                    <p className="mt-1 text-sm text-black/50">
                        Manage system users and their roles
                    </p>
                </div>
                <Button 
                    onClick={() => setIsModalOpen(true)} 
                    className="flex items-center gap-2 font-semibold shadow-sm"
                    size="md"
                >
                    <img src={createIcon} alt="" className="size-3.5 brightness-0 invert" />
                    Create User
                </Button>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-black/2 text-text-muted">
                            <tr className="[&>th]:px-5 [&>th]:py-3 [&>th]:text-left [&>th]:font-semibold">
                                <th>Name</th>
                                <th>Role</th>
                                <th>ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="border-t border-border [&>td]:px-5 [&>td]:py-3">
                                        <td><Skeleton className="h-4 w-32" /></td>
                                        <td><Skeleton className="h-5 w-16 rounded-full" /></td>
                                        <td><Skeleton className="h-4 w-24" /></td>
                                    </tr>
                                ))
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="border-t border-border hover:bg-black/[0.01] [&>td]:px-5 [&>td]:py-3">
                                        <td className="font-medium">{user.name}</td>
                                        <td>
                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                                user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="text-text-muted">{user.id}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}