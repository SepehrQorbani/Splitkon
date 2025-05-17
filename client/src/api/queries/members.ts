import {
    createMember,
    deleteMember,
    getMembers,
    updateMember,
} from "@/api/endpoints/members";
import { queryKeys } from "@/api/queryKeys";
import { MemberRequest } from "@/types/api/members";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const RELATED_QUERIES = ["members", "balance", "expenses", "summary"] as const;

export const useGetMembers = (token: string) => {
    return useQuery({
        queryKey: queryKeys.members(token),
        queryFn: () => getMembers(token),
        enabled: !!token,
        placeholderData: (previousData) => previousData,
    });
};

export const useCreateMember = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ token, data }: { token: string; data: MemberRequest }) =>
            createMember(token, data),
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
            console.error("Failed to create member");
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

export const useUpdateMember = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            token,
            memberId,
            data,
        }: {
            token: string;
            memberId: number;
            data: MemberRequest;
        }) => updateMember(token, memberId, data),
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
            console.error("Failed to update member");
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

export const useDeleteMember = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ token, id }: { token: string; id: number }) =>
            deleteMember(token, id),
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
            console.error("Failed to delete member");
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
