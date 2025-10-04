import Amount from "@/components/common/Amount";
import Avatar from "@/components/common/Avatar";
import AvatarGroup from "@/components/common/AvatarGroup";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import CopyButton from "@/components/common/CopyButton";
import { usePermissions } from "@/hooks/usePermissions";
import { useReportGenerator } from "@/hooks/useReportGenerator";
import { useTranslations } from "@/hooks/useTranslations";
import { useModalStore } from "@/store/modals";
import { Expense } from "@/types/schemas/expenses";
import {
    IconCalendarEvent,
    IconChevronLeft,
    IconEdit,
    IconUsers,
} from "@tabler/icons-react";

type ExpenseCardProps = {
    expense: Expense;
};

function ExpenseCard({ expense }: ExpenseCardProps) {
    const { t, formatDate } = useTranslations();
    const { can } = usePermissions();
    const { generateExpenseReport } = useReportGenerator();
    const spender = expense.spender;
    const hasRatio = expense.members.findIndex((m) => m.ratio !== null) !== -1;
    const openModal = useModalStore((state) => state.openModal);

    return (
        <Card
            className="group hover:shadow-md hover:cursor-pointer gap-2"
            onClick={() => openModal("expenses", expense)}
        >
            <div className="w-full space-y-2" aria-label="Expense Card">
                <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-medium space-y-2 truncate">
                        <h3 className="truncate">{expense.title}</h3>

                        <div className="flex items-center gap-1 text-xs text-muted-soft ps-1">
                            <IconCalendarEvent className="size-4" />
                            {formatDate(new Date(expense.date))}
                        </div>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1">
                        <Amount amount={expense.amount} />
                    </div>
                </div>
            </div>
            <div className="space-y-4 pt-2 mt-auto">
                {spender && (
                    <div className="flex items-center justify-between px-1 pt-2">
                        <div className="text-xs">{t("attributes.spender")}</div>
                        <div className="flex items-center gap-1 text-xs text-muted">
                            {/* <span>{t("attributes.spender")}</span> */}
                            <Avatar
                                size="sm"
                                src={spender.avatar || undefined}
                                alt={spender.name}
                            />
                            <span>{spender.name}</span>
                        </div>
                    </div>
                )}
                <div className="flex items-center justify-between text-xs text-muted">
                    <div className="flex items-center gap-1">
                        <IconUsers className="size-4" />
                        <span>
                            {expense.members.length} {t("member")}
                        </span>
                        {hasRatio && (
                            <>
                                <span>({expense.split}</span>
                                <span>{t("attributes.ratio_unit")})</span>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <AvatarGroup
                            members={expense.members}
                            size="sm"
                            maxVisible={3}
                        />
                        {/* <IconUsers className="size-4" /> */}
                    </div>
                </div>

                <div className="w-full flex items-center justify-between border-t border-border-subtle pt-2 text-muted">
                    <div className="flex items-center gap-2">
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
                    <Button
                        variant="ghost"
                        className="size-8 p-1 text-muted"
                        onPress={() => openModal("expenses", expense)}
                    >
                        <IconChevronLeft className="size-4 text-muted group-hover:stroke-[2.5] group-hover:text-action" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}

export default ExpenseCard;
