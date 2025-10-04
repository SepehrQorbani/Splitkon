import ExpensesFilter from "@/pages/expenses/filters";
import { Expense } from "@/types/schemas/expenses";
import { expenseFilterConfig } from "@/utils/filters/expenseFilterConfig";
import { useFilters } from "@/utils/filters/useFilters";
import { LayoutGroup } from "motion/react";
import ExpenseCard from "./ExpenseCard";

type Props = {
    expenses: Expense[];
};

function ExpensesCard({ expenses }: Props) {
    const { result, ...filterProps } = useFilters(
        expenses ?? [],
        expenseFilterConfig
    );
    return (
        <div className="space-y-4">
            <ExpensesFilter {...filterProps} result={result} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <LayoutGroup>
                    {result.rows?.map((expense) => (
                        <ExpenseCard key={expense.id} expense={expense} />
                    ))}
                </LayoutGroup>
            </div>
        </div>
    );
}

export default ExpensesCard;
