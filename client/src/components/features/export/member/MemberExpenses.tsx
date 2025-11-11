import { useGetExpenses } from "@/api/queries/expenses";
import Amount from "@/components/common/Amount";
import { LoadingIndicator } from "@/components/common/LoadingIndicator";
import { useTranslations } from "@/hooks/useTranslations";
import { useExpenseStore } from "@/store";
import { Member } from "@/types";
import { filterExpensesByMember } from "@/utils/filterExpensesByMember";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router";

type Props = { member: Member };

function MemberExpenses({ member }: Props) {
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
    return isPending && !error ? (
        <div className="flex items-center justify-center flex-1 p-12">
            <LoadingIndicator size="sm" />
        </div>
    ) : (
        <div className="px-4 text-xs my-6 py-4 mx-2">
            <div className="font-bold mb-2">{t("ui.expenses")}</div>
            {memberExpenses.length > 0 ? (
                <table className="w-full border-collapse">
                    <tbody className="w-full border-collapse">
                        {memberExpenses?.map((expense) => (
                            <tr
                                className="border-b border-dashed border-border last:border-none"
                                key={expense.id}
                            >
                                <td className="ps-2 py-4 text-muted">
                                    <div className="text-xs">
                                        <div>{expense.title}</div>
                                        <Amount amount={expense.amount ?? 0} />
                                    </div>
                                </td>
                                <td className="text-end pe-2">
                                    <div className="">
                                        <div>
                                            <Amount
                                                amount={
                                                    expense.members.find(
                                                        (m) =>
                                                            m.id === member.id
                                                    )?.share ?? 0
                                                }
                                            />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="flex items-center gap-1 text-[10px] text-muted">
                    <div className="w-full min-w-4 border-b border-dashed border-border"></div>
                    <div className="shrink-0">{t("ui.noExpenses")}</div>
                    <div className="w-full min-w-4 border-b border-dashed border-border"></div>
                </div>
            )}
        </div>
    );
}

export default MemberExpenses;
