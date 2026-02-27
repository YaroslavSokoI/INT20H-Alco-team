import { useRef, memo } from "react";
import { Button } from "@/components/ui/Button";
import { useKeydown } from "@/hooks/useKeydown";
import { useClickOutside } from "@/hooks/useClickOutside";

interface LogoutConfirmModalProps {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const LogoutConfirmModal = memo(({ open, onConfirm, onCancel }: LogoutConfirmModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useKeydown("Escape", onCancel);
    useClickOutside(modalRef, onCancel);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-in fade-in duration-150">
            <div
                ref={modalRef}
                className="bg-white rounded-2xl border border-border shadow-xl w-full max-w-sm mx-4 p-6 animate-in zoom-in-95 duration-150"
            >
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="size-16 rounded-full bg-orange-50 flex items-center justify-center">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                    </div>

                    <div className="space-y-1.5">
                        <h2 className="text-lg font-bold text-text">Log out?</h2>
                        <p className="text-base text-text-muted">
                            Are you sure you want to log out of your account?
                        </p>
                    </div>

                    <div className="flex gap-3 w-full pt-1">
                        <Button
                            variant="outline"
                            size="md"
                            className="flex-1 rounded-xl"
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            size="md"
                            className="flex-1 rounded-xl bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20"
                            onClick={onConfirm}
                        >
                            Log out
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default LogoutConfirmModal;
