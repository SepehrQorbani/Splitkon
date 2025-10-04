import Amount from "@/components/common/Amount";
import Avatar from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";
import CopyButton from "@/components/common/CopyButton";
import { GenericTable } from "@/components/common/GenericTable";
import { usePermissions } from "@/hooks/usePermissions";
import { useReportGenerator } from "@/hooks/useReportGenerator";
import { useTranslations } from "@/hooks/useTranslations";
import ExpensesFilter from "@/pages/expenses/filters";
import { useModalStore } from "@/store/modals";
import { Expense } from "@/types/schemas/expenses";
import { expenseFilterConfig } from "@/utils/filters/expenseFilterConfig";
import {
    IconCalendarEvent,
    IconCurrencyDollar,
    IconEdit,
    IconEqual,
    IconEye,
    IconPercentage,
    IconUserDollar,
    IconUsers,
} from "@tabler/icons-react";

export default function ExpensesTable({ expenses }: { expenses: Expense[] }) {
    const { t, formatDate } = useTranslations();
    const openModal = useModalStore((state) => state.openModal);

    return (
        <GenericTable<Expense>
            items={expenses}
            filterConfig={expenseFilterConfig}
            FilterComponent={ExpensesFilter}
            columns={[
                {
                    key: "title",
                    label: t("attributes.title"),
                    sortable: true,
                    thClassName: "sticky top-0 right-0 bg-background z-2 w-40",
                    className:
                        "sticky top-0 right-0 bg-surface z-2 whitespace-normal w-40 cursor-pointer",
                    render: (expense) => (
                        <div
                            className="max-w-40 wrap-break-word"
                            onClick={() => {
                                openModal("expenses", expense);
                            }}
                        >
                            {expense.title}
                        </div>
                    ),
                },
                {
                    key: "spender",
                    label: t("attributes.spender"),
                    sortable: true,
                    render: (expense) => (
                        <div className="flex items-center gap-2">
                            <Avatar
                                src={expense.spender?.avatar}
                                alt={expense.spender?.name}
                                size="md"
                            />
                            <div className="flex items-center gap-1">
                                {expense.spender?.name}
                            </div>
                        </div>
                    ),
                },
                {
                    key: "amount",
                    label: t("ui.amount"),
                    sortable: true,
                    render: (expense) => (
                        <div>
                            <Amount amount={expense.amount} />
                        </div>
                    ),
                },
                {
                    key: "date",
                    label: t("attributes.date"),
                    sortable: true,
                    render: (expense) => (
                        <div className="flex items-center text-xs text-muted gap-1">
                            <IconCalendarEvent className="size-3" />
                            {formatDate(new Date(expense.date))}
                        </div>
                    ),
                },
                {
                    key: "split",
                    sortable: true,
                    label: <IconUsers className="size-4" />,
                    thClassName: "text-center leading-0",
                    render: (expense) => (
                        <div className="flex items-center gap-1 text-xs text-center justify-center">
                            <IconUsers className="size-3" />
                            {expense.members.length}
                        </div>
                    ),
                },
                {
                    key: "ratio",
                    label: <IconPercentage className="size-4" />,
                    thClassName: "text-center leading-0",
                    render: (expense) => (
                        <div className="flex items-center gap-1 text-xs text-center justify-center">
                            {expense.members.findIndex(
                                (m) => m.ratio !== null
                            ) !== -1 ? (
                                <>
                                    <IconPercentage className="size-3" />
                                    {expense.split}
                                </>
                            ) : (
                                <IconCurrencyDollar className="size-3" />
                            )}
                        </div>
                    ),
                },
                {
                    key: "",
                    label: <IconEqual className="size-4" />,
                    thClassName: "text-center leading-0",
                    render: (expense) => (
                        <div className="flex items-center gap-1 text-xs text-center justify-center">
                            {expense.members.findIndex(
                                (m) => m.ratio !== null
                            ) !== -1 ? (
                                <Amount
                                    amount={Math.round(
                                        expense.amount / expense.split
                                    )}
                                />
                            ) : (
                                <IconUserDollar className="size-3" />
                            )}
                        </div>
                    ),
                },
                {
                    key: "actions",
                    label: "",
                    render: (expense) => <Actions expense={expense} />,
                },
            ]}
        />
    );
}

const Actions = ({ expense }: { expense: Expense }) => {
    const { can } = usePermissions();
    const { t } = useTranslations();
    const { generateExpenseReport } = useReportGenerator();
    const openModal = useModalStore((state) => state.openModal);

    return (
        <div>
            <Button
                onPress={() => {
                    openModal("expenses", expense);
                }}
                intent="neutral"
                variant="ghost"
                className="h-8 w-8 p-1"
            >
                <IconEye className="w-4 h-4 text-muted" />
            </Button>
            {can("editExpenses") && (
                <Button
                    onPress={() => {
                        openModal("expense-form", expense.id);
                    }}
                    intent="neutral"
                    variant="ghost"
                    className="h-8 w-8 p-1"
                >
                    <IconEdit className="w-4 h-4 text-muted" />
                </Button>
            )}
            <CopyButton
                data={generateExpenseReport(expense)}
                className="h-8 w-8 p-1"
            />
        </div>
    );
};
