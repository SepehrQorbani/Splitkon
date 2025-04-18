import { useState, useCallback } from "react";

interface UseCopyToClipboardOptions {
    timeout?: number;
    onCopy?: (value: string) => void;
    onError?: (error: Error, value: string) => void;
}

export function useCopyToClipboard({
    timeout = 2000,
    onCopy,
    onError,
}: UseCopyToClipboardOptions = {}) {
    const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>(
        {}
    );
    const [error, setError] = useState<Error | null>(null);

    const copyToClipboard = useCallback(
        (value: string) => {
            if (
                typeof window === "undefined" ||
                !navigator.clipboard?.writeText
            ) {
                const err = new Error("Clipboard API not available");
                setError(err);
                onError?.(err, value);
                return;
            }

            if (!value) {
                const err = new Error("No value provided to copy");
                setError(err);
                onError?.(err, value);
                return;
            }

            navigator.clipboard.writeText(value).then(
                () => {
                    setCopiedStates((prev) => ({ ...prev, [value]: true }));
                    setError(null);
                    onCopy?.(value);

                    setTimeout(() => {
                        setCopiedStates((prev) => ({
                            ...prev,
                            [value]: false,
                        }));
                    }, timeout);
                },
                (err) => {
                    setError(err);
                    onError?.(err, value);
                }
            );
        },
        [timeout, onCopy, onError]
    );

    const isCopied = useCallback(
        (value?: string) => {
            if (value === undefined) {
                return Object.values(copiedStates).some((state) => state);
            }
            return !!copiedStates[value];
        },
        [copiedStates]
    );

    return { isCopied, error, copyToClipboard };
}
