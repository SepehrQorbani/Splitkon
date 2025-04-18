import { DailyExpenses, Expense, ExpenseInput } from "@/types/schemas/expenses";

export type ExpenseRequest = ExpenseInput;

export type ExpenseResponse = {
    data: Expense;
};

export type ExpensesResponse = {
    data: Expense[];
};

export type DailyExpensesResponse = {
    data: DailyExpenses;
};
