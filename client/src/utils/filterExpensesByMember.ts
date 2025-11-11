import { Expense } from "@/types/schemas/expenses";

export interface FilterOptions {
    limit?: number;
}

export const filterExpensesByMember = (
    expenses: Expense[],
    memberId: number,
    options: FilterOptions = {}
): Expense[] => {
    const { limit } = options;

    let filtered = expenses.filter((expense) =>
        expense.members.some((member) => member.id === memberId)
    );

    if (limit != null && limit > 0) {
        filtered = filtered.slice(-limit);
    }

    return filtered;
};

// .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
