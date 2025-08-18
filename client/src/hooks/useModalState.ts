import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";

export interface ModalState {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
    setIsOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
}

export interface UseModalStateOptions {
    id?: string | number;
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    onClose?: () => void;
    syncWithUrl?: boolean;
    urlParamName?: string;
}

export function useModalState({
    id,
    isOpen: controlledIsOpen,
    onOpenChange,
    onClose,
    syncWithUrl = true,
    urlParamName = "modal",
}: UseModalStateOptions = {}): ModalState {
    const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const isControlled = controlledIsOpen !== undefined;
    const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;

    const isChangingFromSetIsOpen = useRef(false);

    const setIsOpen = useCallback(
        (value: boolean | ((prev: boolean) => boolean)) => {
            const nextValue =
                typeof value === "function" ? value(isOpen) : value;

            isChangingFromSetIsOpen.current = true;

            if (isControlled) {
                onOpenChange?.(nextValue);
            } else {
                setUncontrolledIsOpen(nextValue);
            }

            if (!nextValue) {
                onClose?.();
            }

            if (syncWithUrl && id !== undefined && !isControlled) {
                setSearchParams(
                    (prev) => {
                        const next = new URLSearchParams(prev);
                        if (nextValue) {
                            next.set(urlParamName, `${id}`);
                        } else {
                            next.delete(urlParamName);
                        }
                        return next;
                    },
                    { replace: false }
                );
            }
        },
        [
            isControlled,
            onOpenChange,
            onClose,
            isOpen,
            syncWithUrl,
            id,
            urlParamName,
            setSearchParams,
        ]
    );

    const open = useCallback(() => setIsOpen(true), [setIsOpen]);
    const close = useCallback(() => setIsOpen(false), [setIsOpen]);
    const toggle = useCallback(() => setIsOpen((prev) => !prev), [setIsOpen]);

    useEffect(() => {
        if (!syncWithUrl || id === undefined || isControlled) return;

        if (isChangingFromSetIsOpen.current) {
            isChangingFromSetIsOpen.current = false;
            return;
        }

        const paramValue = searchParams.get(urlParamName);
        const shouldBeOpen = paramValue === `${id}`;

        if (shouldBeOpen !== uncontrolledIsOpen) {
            setUncontrolledIsOpen(shouldBeOpen);
        }
    }, [
        searchParams,
        id,
        uncontrolledIsOpen,
        isControlled,
        syncWithUrl,
        urlParamName,
    ]);

    return { isOpen, open, close, toggle, setIsOpen };
}
