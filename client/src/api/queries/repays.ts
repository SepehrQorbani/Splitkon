import {
    createRepay,
    getRepay,
    getRepays,
    updateRepay,
} from "@/api/endpoints/repays";
import { queryKeys } from "@/api/queryKeys";
import { RepayRequest } from "@/types/api/repays";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const RELATED_QUERIES = ["repays", "balance", "members", "summary"] as const;

export const useGetRepay = (token: string, id: string) => {
    return useQuery({
        queryKey: queryKeys.repays(token).concat([id]),
        queryFn: () => getRepay(token, id),
        enabled: !!token && !!id,
        placeholderData: (previousData) => previousData,
    });
};

export const useGetRepays = (token: string) => {
    return useQuery({
        queryKey: queryKeys.repays(token),
        queryFn: () => getRepays(token),
        enabled: !!token,
        placeholderData: (previousData) => previousData,
    });
};

export const useCreateRepay = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ token, data }: { token: string; data: RepayRequest }) =>
            createRepay(token, data),
        onMutate: async ({ token }) => {
            await Promise.all(
                RELATED_QUERIES.map((key) =>
                    queryClient.cancelQueries({
                        queryKey: queryKeys[key](token),
                    })
                )
            );
            return { token };
        },
        onError: () => {
            console.error("Failed to create repay");
        },
        onSuccess: (_data, variables) => {
            RELATED_QUERIES.forEach((key) => {
                queryClient.invalidateQueries({
                    queryKey: queryKeys[key](variables.token),
                    refetchType: "active",
                });
            });
        },
    });
};

export const useUpdateRepay = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            token,
            repayId,
            data,
        }: {
            token: string;
            repayId: number;
            data: RepayRequest;
        }) => updateRepay(token, repayId, data),
        onMutate: async ({ token }) => {
            await Promise.all(
                RELATED_QUERIES.map((key) =>
                    queryClient.cancelQueries({
                        queryKey: queryKeys[key](token),
                    })
                )
            );
            return { token };
        },
        onError: () => {
            console.error("Failed to update repay");
        },
        onSuccess: (_data, variables) => {
            RELATED_QUERIES.forEach((key) => {
                queryClient.invalidateQueries({
                    queryKey: queryKeys[key](variables.token),
                    refetchType: "active",
                });
            });
        },
    });
};
