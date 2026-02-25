import { useEffect, useCallback } from "react";

export function useKeydown(key: string, callback: () => void) {
    const handleKeydown = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === key) {
                callback();
            }
        },
        [key, callback]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeydown);
        return () => window.removeEventListener("keydown", handleKeydown);
    }, [handleKeydown]);
}
