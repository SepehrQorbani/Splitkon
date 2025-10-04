import { useModalStore } from "@/store/modals";
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router";

function parseParam(value: string): string | number | boolean {
    if (value === "open") return true;
    if (value === "false") return false; // اضافه: بستن با false
    if (!isNaN(Number(value)) && value.trim() !== "") return Number(value);
    return value;
}
const MODAL_KEYS = [
    "members",
    "member-form",
    "expenses",
    "expense-form",
    "repays",
    "repay-form",
    "share",
];
type ModalValue = boolean | number | { id: string | number } | string;

export function useModalRouterSync() {
    const { modals, openModal, closeModal } = useModalStore() as {
        modals: Record<string, ModalValue>;
        openModal: (key: string, value: ModalValue) => void;
        closeModal: (key: string) => void;
    };
    const [searchParams, setSearchParams] = useSearchParams();
    const ignoreUrlChange = useRef(false);

    // URL → state
    useEffect(() => {
        if (ignoreUrlChange.current) {
            ignoreUrlChange.current = false;
            return;
        }

        const seenKeys = new Set<string>();

        for (const [key, value] of searchParams.entries()) {
            if (!MODAL_KEYS.includes(key)) continue;
            seenKeys.add(key);

            const parsed = parseParam(value);
            if (modals[key] !== parsed) {
                openModal(key, parsed as any);
            }
        }

        // بستن مدال‌هایی که دیگه توی URL نیستن
        for (const key of MODAL_KEYS) {
            if (key in modals && !seenKeys.has(key)) {
                closeModal(key);
            }
        }
    }, [searchParams]);

    // state → URL
    useEffect(() => {
        let changed = false;

        setSearchParams(
            (prev) => {
                const params = new URLSearchParams(prev);

                // فقط مدال‌ها رو سینک می‌کنیم
                for (const key of MODAL_KEYS) {
                    if (key in modals) {
                        const val = modals[key];
                        // const paramVal = val === true ? "open" : String(val);
                        const paramVal =
                            val === true
                                ? "open"
                                : typeof val === "object" && "id" in val
                                ? String(val?.id)
                                : String(val);

                        if (params.get(key) !== paramVal) {
                            params.set(key, paramVal);
                            changed = true;
                        }
                    } else if (params.has(key)) {
                        params.delete(key);
                        changed = true;
                    }
                }

                if (changed) {
                    ignoreUrlChange.current = true;
                    return params;
                }

                return prev;
            },
            { replace: false }
        );
    }, [modals]);
}
