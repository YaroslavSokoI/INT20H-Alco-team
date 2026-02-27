import { useRef, memo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useKeydown } from "@/hooks/useKeydown";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useAuthStore } from "@/store/authStore";

interface UserDeleteModalProps {
    userId: string | number | null;
    onClose: () => void;
}

const UserDeleteModal = memo(({ userId, onClose }: UserDeleteModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const { deleteUser } = useAuthStore();
    const [isDeleting, setIsDeleting] = useState(false);

    useKeydown("Escape", onClose);
    useClickOutside(modalRef, onClose);

    if (userId === null) return null;

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await deleteUser(userId);
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-in fade-in duration-150">
            <div
                ref={modalRef}
                className="bg-white rounded-2xl border border-border shadow-xl w-full max-w-sm mx-4 p-6 animate-in zoom-in-95 duration-150"
            >
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="size-12 rounded-full bg-red-50 flex items-center justify-center">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                            <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                    </div>

                    <div className="space-y-1">
                        <h2 className="text-base font-bold text-text">Delete user?</h2>
                        <p className="text-sm text-text-muted">
                            This action cannot be undone. The user will be permanently removed.
                        </p>
                    </div>

                    <div className="flex gap-3 w-full pt-1">
                        <Button
                            variant="outline"
                            size="md"
                            className="flex-1 rounded-xl"
                            onClick={onClose}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            size="md"
                            className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20"
                            onClick={handleConfirm}
                            isLoading={isDeleting}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default UserDeleteModal;
