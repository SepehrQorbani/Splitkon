import { useGetExpenses } from "@/api/queries/expenses";
import Amount from "@/components/common/Amount";
import { LoadingIndicator } from "@/components/common/LoadingIndicator";
import { useTranslations } from "@/hooks/useTranslations";
import { useExpenseStore } from "@/store";
import { Member } from "@/types";
import { filterExpensesByMember } from "@/utils/filterExpensesByMember";
import { IconCash, IconCashOff, IconCashPlus } from "@tabler/icons-react";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router";

type Props = { member: Member };

function MemberExpensesCard({ member }: Props) {
    const { token } = useParams();
    const { t } = useTranslations();
    const { expenses, setExpenses } = useExpenseStore();
    const { data, isPending, error } = useGetExpenses(token as string);
    useEffect(() => {
        if (data) {
            setExpenses(data.data);
        }
    }, [data, setExpenses]);
    // const expenses = useExpenseStore((state) => state.expenses);
    const memberExpenses = useMemo(() => {
        return expenses ? filterExpensesByMember(expenses, member.id) : [];
    }, [expenses, member]);
    return isPending ? (
        <div className="flex items-center justify-center flex-1 p-12">
            <LoadingIndicator size="sm" />
        </div>
    ) : (
        <div className="w-full px-2 bg-background rounded-md border border-border">
            <div className="text-xs font-bold ps-1 py-2 border-b border-border flex items-center gap-1">
                <IconCash className="size-3.5" />
                <div>{t("ui.expenses")}</div>
            </div>
            {memberExpenses.length > 0 ? (
                memberExpenses?.map((expense) => {
                    return (
                        <div
                            key={expense.id}
                            className="border-t border-border overflow-clip p-4 flex flex-col gap-2"
                        >
                            <div className="flex justify-between items-center relative">
                                <div className="flex items-center gap-1 text-xs">
                                    <IconCashPlus className="size-3.5" />
                                    {expense.title}
                                </div>

                                <div>
                                    <Amount amount={expense.amount ?? 0} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center justify-end gap-1 text-xs shrink-0">
                                    <span>{t("ui.ratio")}</span>
                                </div>
                                <div className="w-full min-w-4 border-b border-dashed border-border"></div>

                                <div className="shrink-0">
                                    <Amount
                                        amount={
                                            expense.members.find(
                                                (m) => m.id === member.id
                                            )?.share ?? 0
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="flex items-center gap-1 text-[10px] text-muted p-4">
                    <IconCashOff className="size-3.5" />
                    <div className="shrink-0">{t("ui.noExpenses")}</div>
                </div>
            )}
        </div>
    );
}

export default MemberExpensesCard;
