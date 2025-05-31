import { useGetExpenses } from "@/api/queries/expenses";
import AsyncContent from "@/components/common/AsyncContent";
import { Button } from "@/components/common/Button";
import { Drawer } from "@/components/common/Drawer";
import ExpenseCard from "@/components/features/expenses/ExpenseCard";
import { ExpenseCardSkeleton } from "@/components/features/expenses/ExpenseCardSkeleton";
import { ExpenseForm } from "@/components/features/expenses/ExpenseForm";
import { usePermissions } from "@/hooks/usePermissions";
import { useTranslations } from "@/hooks/useTranslations";
import { useExpenseStore } from "@/store/expenses";
import { cn } from "@/utils/cn";
import { IconCashPlus } from "@tabler/icons-react";
import { LayoutGroup } from "motion/react";
import { useEffect } from "react";
import { useParams } from "react-router";
import { motion } from "motion/react";
import { CardStack } from "@/components/common/CardStack";
import ExpenseCardStackItem from "@/components/common/ExpenseCardStackItem";
import { EmptyState } from "@/components/common/EmptyState";

type Props = {};

function ExpensesIndex({}: Props) {
    const { token } = useParams();
    const { expenses, setExpenses } = useExpenseStore();
    const { t } = useTranslations();
    const { can } = usePermissions();

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
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array(6)
                            .fill(0)
                            .map((_, index) => (
                                <ExpenseCardSkeleton key={index} />
                            ))}
                    </div>
                </div>
            }
        >
            {expenses && expenses?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <LayoutGroup>
                        {expenses?.map((expense) => (
                            <ExpenseCard key={expense.id} expense={expense} />
                        ))}
                    </LayoutGroup>
                </div>
            ) : (
                <EmptyState
                    items={[
                        { id: 1, content: <ExpenseCardStackItem /> },
                        { id: 2, content: <ExpenseCardStackItem /> },
                        { id: 3, content: <ExpenseCardStackItem /> },
                    ]}
                    message="هنوز هیچ هزینه ای ثبت نشده"
                    action={
                        can("addExpenses") && (
                            <Drawer
                                buttonProps={{ className: "h-10 gap-2" }}
                                triggerLabel={
                                    <>
                                        <IconCashPlus className="size-4 mx-0.5" />
                                        <span className=" text-sm ms-1">
                                            {t("ui.newExpense")}
                                        </span>
                                    </>
                                }
                                title={
                                    <div className="flex items-center gap-2">
                                        <IconCashPlus className="size-4 mx-0.5" />
                                        <span className="text-sm">
                                            {t("ui.newExpense")}
                                        </span>
                                    </div>
                                }
                                children={({ close }) => (
                                    <ExpenseForm onSubmitSuccess={close} />
                                )}
                            />
                        )
                    }
                />
            )}
        </AsyncContent>
    );
}

export default ExpensesIndex;
