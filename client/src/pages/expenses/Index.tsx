import { useGetExpenses } from "@/api/queries/expenses";
import AsyncContent from "@/components/common/AsyncContent";
import { Button, getButtonStyles } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";
import ExpenseCardStackItem from "@/components/common/ExpenseCardStackItem";
import FiltersSkeleton from "@/components/common/filters/FiltersSkeleton";
import TableSkeleton from "@/components/common/TableSkeleton";
import { ExpenseCardSkeleton } from "@/components/features/expenses/ExpenseCardSkeleton";
import ExpensesCard from "@/components/features/expenses/ExpensesCard";
import ExpensesTable from "@/components/features/expenses/ExpensesTable";
import { usePermissions } from "@/hooks/usePermissions";
import { useTranslations } from "@/hooks/useTranslations";
import { useMemberStore, useUIStore } from "@/store";
import { useExpenseStore } from "@/store/expenses";
import { useModalStore } from "@/store/modals";
import {
    IconCashPlus,
    IconHelpCircle,
    IconInfoCircle,
    IconSettings,
} from "@tabler/icons-react";
import { useEffect } from "react";
import { NavLink, useParams } from "react-router";

type Props = {};

function ExpensesIndex({}: Props) {
    const { token } = useParams();
    const { expenses, setExpenses } = useExpenseStore();
    const members = useMemberStore((state) => state.members);
    const { t } = useTranslations();
    const view = useUIStore((state) => state.view);
    const { can } = usePermissions();
    const openModal = useModalStore((state) => state.openModal);

    const { data, isLoading, error, refetch } = useGetExpenses(token as string);

    useEffect(() => {
        if (data) {
            setExpenses(data.data);
        }
    }, [data, setExpenses]);

    return (
        <AsyncContent
            isLoading={isLoading}
            error={error}
            refetch={refetch}
            skeleton={
                view === "grid" ? (
                    <div>
                        <FiltersSkeleton />

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array(6)
                                .fill(0)
                                .map((_, index) => (
                                    <ExpenseCardSkeleton key={index} />
                                ))}
                        </div>
                    </div>
                ) : (
                    <TableSkeleton />
                )
            }
        >
            {expenses && expenses.length > 0 ? (
                <>
                    {view === "grid" ? (
                        <ExpensesCard expenses={expenses} />
                    ) : (
                        <div>
                            <ExpensesTable expenses={expenses} />
                        </div>
                    )}
                    {/* <ExpenseDetailModal /> */}
                </>
            ) : (
                <EmptyState
                    items={[
                        { id: 1, content: <ExpenseCardStackItem /> },
                        { id: 2, content: <ExpenseCardStackItem /> },
                        { id: 3, content: <ExpenseCardStackItem /> },
                    ]}
                    message={
                        <div className="space-y-4 mt-4">
                            <p>{t("ui.noExpenses")}</p>
                            {members.length < 2 && (
                                <div className="flex flex-col items-center gap-4 ">
                                    <div className="text-xs flex items-center gap-1">
                                        <IconInfoCircle className="size-4" />
                                        {t("ui.minMemberIsTwo")}
                                    </div>
                                    <div className="text-xs flex items-center gap-1">
                                        <IconHelpCircle className="size-4" />
                                        {t("ui.addMembersFromSetting")}
                                    </div>
                                </div>
                            )}
                        </div>
                    }
                    action={
                        members.length < 2 ? (
                            <NavLink
                                to={`/${token}/setting`}
                                className={getButtonStyles({
                                    className: "mx-auto",
                                })}
                            >
                                <div className="flex gap-1 items-center text-xs">
                                    <IconSettings className="size-4" />
                                    <span>{t("ui.settings")}</span>
                                </div>
                            </NavLink>
                        ) : (
                            can("addExpenses") && (
                                <Button
                                    className="px-3 py-2 h-8 min-w-8 gap-1"
                                    onPress={() => {
                                        openModal("expense-form", true);
                                    }}
                                    isDisabled={members.length < 2}
                                >
                                    <IconCashPlus className="size-4 mx-0.5" />
                                    <span className="text-xs ms-1">
                                        {t("ui.newExpense")}
                                    </span>
                                </Button>
                            )
                        )
                    }
                />
            )}
        </AsyncContent>
    );
}

export default ExpensesIndex;
