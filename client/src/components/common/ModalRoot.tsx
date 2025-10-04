// ModalRoot.tsx

import { useModalStore } from "@/store/modals";
import ExpenseDetailModal from "../features/expenses/ExpenseDetailModal";
import ExpenseFormModal from "../features/expenses/ExpenseFormModal";
import MemberDetailModal from "../features/members/MemberDetailModal";
import MemberFormModal from "../features/members/MemberFormModal";
import RepayDetailModal from "../features/repays/RepayDetailModal";
import RepayFormModal from "../features/repays/RepayFormModal";
import ShareModal from "../features/share/ShareModal";
import {
    AnimatePresence,
    motion,
    PanInfo,
    useDragControls,
} from "motion/react";
import { useEffect, useState } from "react";

const modalRegistry: Record<string, React.ReactNode> = {
    members: <MemberDetailModal />,
    "member-form": <MemberFormModal />,
    expenses: <ExpenseDetailModal />,
    "expense-form": <ExpenseFormModal />,
    repays: <RepayDetailModal />,
    "repay-form": <RepayFormModal />,
    share: <ShareModal />,
};

export function ModalRoot() {
    const modals = useModalStore((state) => state.modals);
    const isLoading = useModalStore((s) => s.isLoading);
    const [mountedKeys, setMountedKeys] = useState<string[]>([]);

    useEffect(() => {
        let timeoutIds: number[] = [];

        const keys = Object.keys(modals);

        if (keys.length) {
            setMountedKeys([]);
            keys.forEach((key, i) => {
                const id = window.setTimeout(() => {
                    setMountedKeys((prev) => [...prev, key]);
                }, i * 50); // فاصله‌ی mount شدن هر مدال
                timeoutIds.push(id);
            });
        } else {
            setMountedKeys([]);
        }

        return () => {
            timeoutIds.forEach(clearTimeout);
        };
    }, [modals]);
    return (
        <AnimatePresence>
            {mountedKeys.map((key, index) => {
                const Renderer = modalRegistry[key];
                const data = modals[key];

                if (!Renderer || isLoading?.[key]) return null;

                return (
                    <motion.div
                        key={key}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ zIndex: 1000 + index * 2 }}
                    >
                        {Renderer}
                    </motion.div>
                );
            })}
        </AnimatePresence>
    );
}
