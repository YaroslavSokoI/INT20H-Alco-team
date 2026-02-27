import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import UserModal from "./UserModal";
import UserEditModal from "./UserEditModal";
import UserDeleteModal from "./UserDeleteModal";
import { createIcon } from "@/assets/assets.ts";
import { Skeleton } from "@/components/ui/Skeleton";
import type { User } from "@/types/user";

export default function UsersPage() {
    const { user, users, fetchUsers } = useAuthStore();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [deleteUserId, setDeleteUserId] = useState<string | number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAdmin = user?.role === 'admin';

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
                {isAdmin && (
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 font-semibold shadow-sm"
                        size="md"
                    >
                        <img src={createIcon} alt="" className="size-3.5 brightness-0 invert" />
                        Create User
                    </Button>
                )}
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-black/2 text-text-muted">
                            <tr className="[&>th]:px-5 [&>th]:py-3 [&>th]:text-left [&>th]:font-semibold">
                                <th>Login</th>
                                <th>Role</th>
                                <th>ID</th>
                                <th className="text-right w-24"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="border-t border-border [&>td]:px-5 [&>td]:py-3">
                                        <td><Skeleton className="h-4 w-32" /></td>
                                        <td><Skeleton className="h-5 w-16 rounded-full" /></td>
                                        <td><Skeleton className="h-4 w-24" /></td>
                                        <td className="w-24 px-5">
                                            <div className="flex justify-end gap-2">
                                                <Skeleton className="size-8 rounded-lg" />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                users.map((u: User) => (
                                    <tr key={u.id} className="border-t border-border hover:bg-black/[0.01] [&>td]:px-5 [&>td]:py-3">
                                        <td className="font-medium">{u.login}</td>
                                        <td>
                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${u.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="text-text-muted">{u.id}</td>
                                        <td className="w-24 px-5">
                                            <div className="flex justify-end gap-2">
                                                {(String(user?.id) === String(u.id) || isAdmin) && (
                                                    <button onClick={() => setEditUser(u)} className="text-xs font-semibold text-yellow-500 hover:opacity-70 transition-opacity cursor-pointer">
                                                        edit
                                                    </button>
                                                )}
                                                {isAdmin && String(user?.id) !== String(u.id) && (
                                                    <button onClick={() => setDeleteUserId(u.id)} className="text-xs font-semibold text-red-500 hover:opacity-70 transition-opacity cursor-pointer">
                                                        delete
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <UserModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
            <UserEditModal isOpen={!!editUser} user={editUser} onClose={() => setEditUser(null)} />
            <UserDeleteModal userId={deleteUserId} onClose={() => setDeleteUserId(null)} />
        </div>
    );
}