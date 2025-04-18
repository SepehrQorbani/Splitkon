import { Expense } from "@/types/schemas/expenses";
import { create } from "zustand";

interface ExpenseStore {
    expenses: Expense[] | null;
    setExpenses: (expenses: Expense[]) => void;
    addExpense: (expense: Expense) => void;
    updateExpense: (updatedExpense: Expense) => void;
}

export const useExpenseStore = create<ExpenseStore>((set) => ({
    expenses: null,
    setExpenses: (expenses) => set({ expenses }),
    addExpense: (expense) =>
        set((state) => ({
            expenses: state.expenses ? [...state.expenses, expense] : [expense],
        })),
    updateExpense: (updatedExpense) =>
        set((state) => ({
            expenses: state.expenses
                ? state.expenses.map((exp) =>
                      exp.id === updatedExpense.id ? updatedExpense : exp
                  )
                : [updatedExpense],
        })),
}));
