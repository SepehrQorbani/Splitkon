import { getExpenses } from "@/api/endpoints/expenses";
import AsyncContent from "@/components/common/AsyncContent";
import ExpenseCard from "@/components/features/expenses/ExpenseCard";
import { ExpenseCardSkeleton } from "@/components/features/expenses/ExpenseCardSkeleton";
import { useExpenseStore } from "@/store/expenses";
import { useQuery } from "@tanstack/react-query";
import { LayoutGroup } from "motion/react";
import { useEffect } from "react";
import { useParams } from "react-router";

type Props = {};

function ExpensesIndex({}: Props) {
    const { token } = useParams();
    const { expenses, setExpenses } = useExpenseStore();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["expenses", token],
        queryFn: () => getExpenses(token as string),
    });

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {expenses && expenses.length > 0 && (
                    <LayoutGroup>
                        {expenses?.map((expense) => (
                            <ExpenseCard key={expense.id} expense={expense} />
                        ))}
                    </LayoutGroup>
                )}
            </div>
        </AsyncContent>
    );
}

export default ExpensesIndex;
