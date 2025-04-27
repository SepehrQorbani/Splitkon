import Avatar from "@/components/common/Avatar";
import { useTranslations } from "@/hooks/useTranslations";
import { Expense } from "@/types/schemas/expenses";
import { cn } from "@/utils/cn";
import {
    IconCalculator,
    IconDivide,
    IconEqual,
    IconPencilDollar,
    IconPercentage,
    IconUsers,
    IconX,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { Drawer } from "@/components/common/Drawer";
import ExpandableCard from "@/components/common/ExpandableCard";
import { ExpenseForm } from "./ExpenseForm";
import { useReportGenerator } from "@/hooks/useReportGenerator";
import CopyButton from "@/components/common/CopyButton";
import Amount from "@/components/common/Amount";
import { usePermissions } from "@/hooks/usePermissions";

type ExpenseCardProps = {
    expense: Expense;
};

function ExpenseCard({ expense }: ExpenseCardProps) {
    const { canEdit } = usePermissions();
    const { t, formatDate } = useTranslations();
    const id = `expense-${expense.id}`;
    const { generateExpenseReport } = useReportGenerator();

    const spender = expense.spender;

    return (
        <ExpandableCard id={id}>
            {({ isOpen }) => {
                return (
                    <motion.div
                        layoutId={`${id}-expense-card-content`}
                        className={cn(
                            "relative bg-surface w-full pb-4 rounded ring-1 ring-border space-y-4 shadow-sm overflow-y-auto max-h-full",
                            isOpen
                                ? "shadow-lg overflow-y-auto"
                                : "hover:shadow-md hover:cursor-pointer"
                        )}
                    >
                        <motion.div
                            layoutId={`${id}-expense-header`}
                            className={cn(
                                "w-full space-y-2",
                                "sticky top-0 bg-surface pt-4 px-3 pb-2"
                            )}
                            aria-label="Expense Card"
                        >
                            <div className="flex items-center justify-between border-b border-border">
                                <div className="flex items-center text-sm font-medium px-1 gap-1">
                                    {expense.title}
                                    {canEdit && (
                                        <Drawer
                                            triggerLabel={
                                                <IconPencilDollar className="w-4 h-4 text-muted" />
                                            }
                                            title={t("expense")}
                                            children={({ close }) => (
                                                <ExpenseForm
                                                    onSubmitSuccess={close}
                                                    expense={expense}
                                                />
                                            )}
                                            buttonProps={{
                                                intent: "neutral",
                                                variant: "ghost",
                                                className: "h-8 w-8 p-1",
                                            }}
                                        />
                                    )}
                                    <CopyButton
                                        data={generateExpenseReport(expense)}
                                        className="h-8 w-8 p-1"
                                    />
                                </div>
                                <div className="text-xs text-gray-500 px-1">
                                    <span>
                                        {formatDate(new Date(expense.date))}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between px-1 pt-2">
                                {spender && (
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        {/* <span>{t("attributes.spender")}</span> */}
                                        <Avatar
                                            size="sm"
                                            src={spender.avatar || undefined}
                                            alt={spender.name}
                                        />
                                        <span>{spender.name}</span>
                                    </div>
                                )}
                                <div className="text-sm font-medium">
                                    <Amount amount={expense.amount} />
                                </div>
                            </div>
                        </motion.div>
                        <div className="px-4 space-y-4">
                            {isOpen && expense.description && (
                                <div className="text-sm text-gray-700">
                                    <span className="font-medium">
                                        {t("attributes.description")}:{" "}
                                    </span>
                                    {expense.description}
                                </div>
                            )}

                            <motion.div
                                layoutId={`${id}-expense-split`}
                                className="flex items-center justify-between text-xs text-muted"
                            >
                                <div className="flex items-center gap-1">
                                    <IconUsers className="size-4" />
                                    <span>
                                        {expense.members.length} {t("member")}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <IconPercentage className="size-4" />
                                    <span>{expense.split}</span>
                                    <span>{t("attributes.ratio_unit")}</span>
                                </div>
                            </motion.div>
                            {isOpen && (
                                <div className="w-full flex items-center justify-between text-xs bg-muted-faint border border-border px-1 py-2 rounded">
                                    <div>
                                        <IconCalculator className="size-4" />
                                    </div>
                                    <div
                                        className="flex items-center gap-1"
                                        dir="ltr"
                                    >
                                        {expense.amount}
                                        <IconDivide className="size-3" />
                                        {expense.split}
                                        <IconEqual className="size-3" />
                                        {expense.amount / expense.split}
                                        <IconX className="size-3" />
                                        {t("attributes.ratio_unit")}
                                    </div>
                                </div>
                            )}

                            {/* Expanded State Details */}
                            {isOpen && (
                                <>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{
                                            delay: 0.1,
                                            duration: 0.3,
                                        }}
                                        className="mt-4 space-y-4"
                                    >
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-medium text-muted">
                                                {t("attributes.members")}
                                                {/* {t("expense.participants")} */}
                                            </h3>
                                            <div className="space-y-2">
                                                {expense.members.map(
                                                    (member) => (
                                                        <div
                                                            key={member.id}
                                                            className="flex items-center justify-between gap-2 p-2 rounded bg-muted/10 border border-border"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <Avatar
                                                                    size="sm"
                                                                    src={
                                                                        member.avatar ||
                                                                        undefined
                                                                    }
                                                                    alt={
                                                                        member.name
                                                                    }
                                                                />
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm">
                                                                        {
                                                                            member.name
                                                                        }
                                                                    </span>
                                                                    <span className="text-xs text-gray-500">
                                                                        <IconX className="size-2.5 inline" />
                                                                        {
                                                                            member.ratio
                                                                        }
                                                                        {/* {t(
                                                                            "attributes.ratio_unit"
                                                                        )} */}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="text-sm">
                                                                <Amount
                                                                    amount={
                                                                        member.share
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </div>
                    </motion.div>
                );
            }}
        </ExpandableCard>
    );
}

export default ExpenseCard;
