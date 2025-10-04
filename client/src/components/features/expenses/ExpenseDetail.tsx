import Amount from "@/components/common/Amount";
import Avatar from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";
import CopyButton from "@/components/common/CopyButton";
import { usePermissions } from "@/hooks/usePermissions";
import { useReportGenerator } from "@/hooks/useReportGenerator";
import { useTranslations } from "@/hooks/useTranslations";
import { useModalStore } from "@/store/modals";
import { Expense } from "@/types/schemas/expenses";
import {
    IconCalendarEvent,
    IconDivide,
    IconEdit,
    IconEqual,
    IconQuestionMark,
    IconScript,
    IconUsers,
    IconX,
} from "@tabler/icons-react";

type Props = {};

function ExpenseDetail({
    expense,
    onClose,
}: {
    expense: Expense | null;
    onClose: () => void;
}) {
    const { t, formatDate } = useTranslations();
    const spender = expense?.spender;
    const hasRatio = expense?.members.findIndex((m) => m.ratio !== null) !== -1;

    return (
        spender &&
        expense && (
            <div className="px-2 space-y-4">
                <div className="shrink-0 flex justify-between items-center gap-2">
                    <div className="text-xs shrink-0">{t("amount")}</div>
                    <div className="border-b w-full h-1 border-border"></div>
                    <div className="shrink-0">
                        <Amount amount={expense.amount} />
                    </div>
                </div>
                <div className="flex items-center justify-between px-1 pt-2 gap-2">
                    <div className="shrink-0 text-xs">{t("spender")}</div>
                    <div className="border-b w-full h-1 border-border"></div>
                    <div className="flex items-center gap-1 text-xs text-muted shrink-0">
                        {/* <span>{t("attributes.spender")}</span> */}
                        <Avatar
                            size="sm"
                            src={spender.avatar || undefined}
                            alt={spender.name}
                        />
                        <span>{spender.name}</span>
                    </div>
                </div>
                {expense.description && (
                    <div className="text-xs bg-background rounded border border-border p-2">
                        <p className="font-medium pb-2 text-muted">
                            <IconScript className="inline text-muted-soft size-4 me-1" />
                            {t("attributes.description")}:
                        </p>
                        {expense.description}
                    </div>
                )}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-muted">
                            {t("attributes.members")}
                            {/* {t("expense.participants")} */}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-muted">
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
                    </div>
                    {hasRatio && (
                        <div className="w-full flex items-center justify-between text-xs bg-surface border border-border p-2 rounded">
                            <div>
                                <IconQuestionMark className="size-6 p-1 bg-muted-faint text-action rounded" />
                            </div>
                            <div className="flex items-center gap-1" dir="ltr">
                                {expense.amount}
                                <IconDivide className="size-3" />
                                {expense.split}
                                <IconEqual className="size-3" />
                                {Math.round(expense.amount / expense.split)}
                                <IconX className="size-3" />
                                {t("attributes.ratio_unit")}
                            </div>
                        </div>
                    )}
                    <div className="space-y-2">
                        {expense.members.map((member) => (
                            <div
                                key={member.id}
                                className="flex items-center justify-between gap-2 p-2 rounded bg-muted/10 border border-border"
                            >
                                <div className="flex items-center gap-2">
                                    <Avatar
                                        size="sm"
                                        src={member.avatar || undefined}
                                        alt={member.name}
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm">
                                            {member.name}
                                        </span>
                                        {hasRatio && (
                                            <span className="text-xs text-gray-500">
                                                <IconX className="size-2.5 inline" />
                                                {member.ratio}
                                                {/* {t(
                                                                            "attributes.ratio_unit"
                                                                        )} */}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-sm">
                                    <Amount amount={member.share} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    );
}

export default ExpenseDetail;

export function ExpenseDetailTitle({
    expense,
    onClose,
}: {
    expense: Expense | null;
    onClose: () => void;
}) {
    const { t, formatDate } = useTranslations();
    const { can } = usePermissions();
    const { generateExpenseReport } = useReportGenerator();
    const openModal = useModalStore((state) => state.openModal);

    return (
        expense && (
            <div className="">
                <div
                    className="w-full sticky top-0 bg-surface pb-2 flex items-center justify-between"
                    aria-label="expense-detail-title"
                >
                    <div className="flex items-center gap-1 text-xs text-muted-soft">
                        <IconCalendarEvent className="size-4" />
                        {formatDate(new Date(expense.date))}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
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
                        <Button
                            variant="ghost"
                            className="size-8 p-1 text-muted"
                            onPress={onClose}
                        >
                            <IconX className="size-4" />
                        </Button>
                    </div>
                </div>
                <h3>{expense.title}</h3>
            </div>
        )
    );
}
