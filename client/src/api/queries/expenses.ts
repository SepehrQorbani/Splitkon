import { ExpenseRequest } from "@/types/api/expenses";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createExpense,
    getDailyExpenseTotals,
    getExpenses,
    updateExpense,
} from "../endpoints/expenses";
import { queryKeys } from "../queryKeys";

const EXPENSE_RELATED_QUERIES = [
    "expenses",
    "members",
    "summary",
    "dailyExpenses",
] as const;

export const useGetExpenses = (token: string) => {
    return useQuery({
        queryKey: queryKeys.expenses(token),
        queryFn: () => getExpenses(token),
        enabled: !!token,
        placeholderData: (previousData) => previousData,
    });
};

export const useGetDailyExpenseTotals = (token: string) => {
    return useQuery({
        queryKey: queryKeys.dailyExpenses(token),
        queryFn: () => getDailyExpenseTotals(token),
        enabled: !!token,
        placeholderData: (previousData) => previousData,
    });
};

export const useCreateExpense = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            token,
            data,
        }: {
            token: string;
            data: ExpenseRequest;
        }) => createExpense(token, data),
        onMutate: async ({ token, data }) => {
            await Promise.all(
                EXPENSE_RELATED_QUERIES.map((key) =>
                    queryClient.cancelQueries({
                        queryKey: queryKeys[key](token),
                    })
                )
            );

            return { token };
        },
        onError: () => {
            console.error("Failed to create expense");
        },
        onSuccess: (_data, variables) => {
            EXPENSE_RELATED_QUERIES.forEach((key) => {
                queryClient.invalidateQueries({
                    queryKey: queryKeys[key](variables.token as string),
                    refetchType: "active",
                });
            });
        },
    });
};

export const useUpdateExpense = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            token,
            expenseId,
            data,
        }: {
            token: string;
            expenseId: number;
            data: ExpenseRequest;
        }) => updateExpense(token, expenseId, data),
        onMutate: async ({ token, expenseId, data }) => {
            await Promise.all(
                EXPENSE_RELATED_QUERIES.map((key) =>
                    queryClient.cancelQueries({
                        queryKey: queryKeys[key](token),
                    })
                )
            );

            return { token };
        },
        onError: (error, _, context) => {
            console.error("Failed to update expense");
        },
        onSuccess: (_data, variables) => {
            EXPENSE_RELATED_QUERIES.forEach((key) => {
                queryClient.invalidateQueries({
                    queryKey: queryKeys[key](variables.token as string),
                    refetchType: "active",
                });
            });
        },
    });
};
