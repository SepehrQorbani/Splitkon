import { apiFetch } from "@/api/fetch";
import {
    ExpenseRequest,
    ExpenseResponse,
    ExpensesResponse,
} from "@/types/api/expenses";

export const createExpense = async (
    token: string,
    data: ExpenseRequest
): Promise<ExpenseResponse> => {
    return apiFetch<ExpenseResponse>(`/api/groups/${token}/expenses`, {
        method: "POST",
        body: JSON.stringify(data),
    });
};

export const updateExpense = async (
    token: string,
    expense_id: number,
    data: ExpenseRequest
): Promise<ExpenseResponse> => {
    return apiFetch<ExpenseResponse>(
        `/api/groups/${token}/expenses/${expense_id}`,
        {
            method: "PATCH",
            body: JSON.stringify(data),
        }
    );
};

export const getExpense = async (
    token: string,
    id: string
): Promise<ExpenseResponse> => {
    return apiFetch<ExpenseResponse>(`/api/groups/${token}/expenses/${id}`, {
        method: "GET",
    });
};

export const getExpenses = async (token: string): Promise<ExpensesResponse> => {
    return apiFetch<ExpensesResponse>(`/api/groups/${token}/expenses`, {
        method: "GET",
    });
};

export const getDailyExpenseTotals = async (
    token: string
): Promise<ExpensesResponse> => {
    return apiFetch<ExpensesResponse>(
        `/api/groups/${token}/expenses/daily-totals`,
        {
            method: "GET",
        }
    );
};
