import { useCallback, useState } from "react";

interface UseShareOptions {
    onShare?: (value: string) => void;
    onError?: (error: Error, value: string) => void;
}

interface ShareData {
    title?: string;
    text?: string;
    url: string;
}

export function useShare({ onShare, onError }: UseShareOptions = {}) {
    const [isShared, setIsShared] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const canShare = useCallback(
        (data: ShareData) =>
            typeof navigator !== "undefined" &&
            !!navigator.share &&
            !!navigator.canShare &&
            navigator.canShare(data),
        []
    );

    const share = useCallback(
        (data: ShareData) => {
            if (!data.url) {
                const err = new Error("No URL provided to share");
                setError(err);
                onError?.(err, data.url);
                return;
            }

            if (!canShare(data)) {
                const err = new Error("Sharing not supported on this device");
                setError(err);
                onError?.(err, data.url);
                return;
            }

            navigator.share(data).then(
                () => {
                    setIsShared(true);
                    setError(null);
                    onShare?.(data.url);

                    setTimeout(() => setIsShared(false), 2000);
                },
                (err) => {
                    setError(err);
                    onError?.(err, data.url);
                }
            );
        },
        [canShare, onShare, onError]
    );

    return { isShared, error, canShare, share };
}
