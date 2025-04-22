import Avatar from "@/components/common/Avatar";
import { useTranslations } from "@/hooks/useTranslations";
import { Repay } from "@/types/schemas/repays";
import { cn } from "@/utils/cn";
import {
    IconArrowLeft,
    IconArrowRight,
    IconPencilDollar,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { Drawer } from "@/components/common/Drawer";
import ExpandableCard from "@/components/common/ExpandableCard";
import { RepaysForm } from "./RepayForm";

type RepayCardProps = {
    repay: Repay;
};

function RepayCard({ repay }: RepayCardProps) {
    const { t, direction, formatDate } = useTranslations();
    const id = `repay-${repay.id}`;

    const fromMember = repay.from;
    const toMember = repay.to;

    return (
        <ExpandableCard id={id}>
            {({ isOpen }) => (
                <motion.div
                    layoutId={`${id}-repay-card-content`}
                    className={cn(
                        "relative bg-surface w-full px-4 pb-4 rounded ring-1 ring-border space-y-4 shadow-sm overflow-y-auto max-h-full",
                        isOpen
                            ? "shadow-lg overflow-y-auto"
                            : "hover:shadow-md hover:cursor-pointer"
                    )}
                >
                    <motion.div
                        layoutId={`${id}-repay-header`}
                        className={cn(
                            "flex items-center justify-between w-full",
                            "sticky top-0 bg-surface pt-4 pb-2"
                        )}
                        aria-label="Repay Card"
                    >
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center text-sm font-medium">
                                {t("repayment")}
                                <Drawer
                                    triggerLabel={
                                        <IconPencilDollar className="w-4 h-4 text-muted" />
                                    }
                                    title={t("edit_repayment")}
                                    children={({ close }) => (
                                        <RepaysForm
                                            onSubmitSuccess={close}
                                            repay={repay}
                                        />
                                    )}
                                    buttonProps={{
                                        intent: "neutral",
                                        variant: "ghost",
                                        className: "h-8 w-8 p-1",
                                    }}
                                />
                            </div>
                            <div className="text-xs text-gray-500">
                                {formatDate(new Date(repay.date))}
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <div className="text-sm font-medium">
                                <span>{repay.amount.toLocaleString()}</span>
                                <span className="text-xs text-gray-500">
                                    {" "}
                                    تومان
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {!isOpen && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 justify-between">
                            <div className="flex items-center gap-2">
                                <Avatar
                                    size="sm"
                                    src={fromMember.avatar || undefined}
                                    alt={fromMember.name}
                                />
                                <span>{fromMember.name}</span>
                            </div>
                            <div>
                                {direction === "rtl" ? (
                                    <IconArrowLeft className="size-4" />
                                ) : (
                                    <IconArrowRight className="size-4" />
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <Avatar
                                    size="sm"
                                    src={toMember.avatar || undefined}
                                    alt={toMember.name}
                                />
                                <span>{toMember.name}</span>
                            </div>
                        </div>
                    )}

                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                            className="mt-4 space-y-4"
                        >
                            {repay.description && (
                                <div className="text-sm text-gray-700">
                                    <span className="font-medium">
                                        {t("description")}:{" "}
                                    </span>
                                    {repay.description}
                                </div>
                            )}

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-muted">
                                    {t("details")}
                                </h3>
                                <div className="flex items-center justify-between gap-2 p-2 rounded bg-muted/10 border border-border">
                                    <div className="flex items-center gap-2">
                                        <Avatar
                                            size="sm"
                                            src={fromMember.avatar || undefined}
                                            alt={fromMember.name}
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500">
                                                {t("from")}
                                            </span>
                                            <span className="text-sm">
                                                {fromMember.name}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-sm">
                                        <span>
                                            {repay.amount.toLocaleString()}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {" "}
                                            تومان
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-2 p-2 rounded bg-muted/10 border border-border">
                                    <div className="flex items-center gap-2">
                                        <Avatar
                                            size="sm"
                                            src={toMember.avatar || undefined}
                                            alt={toMember.name}
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500">
                                                {t("to")}
                                            </span>
                                            <span className="text-sm">
                                                {toMember.name}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-sm">
                                        <span>
                                            {repay.amount.toLocaleString()}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {" "}
                                            تومان
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </ExpandableCard>
    );
}

export default RepayCard;
