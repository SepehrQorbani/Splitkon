import { GroupRequest, GroupUpdateRequest } from "@/types/api/group";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createGroup, getGroup, updateGroup } from "../endpoints/groups";
import { queryKeys } from "../queryKeys";

const EXPENSE_RELATED_QUERIES = ["group"] as const;

export const useGetGroup = (token: string) => {
    return useQuery({
        queryKey: queryKeys.group(token),
        queryFn: () => getGroup(token),
        enabled: !!token,
        placeholderData: (previousData) => previousData,
    });
};

export const useCreateGroup = () => {
    return useMutation({
        mutationFn: ({ data }: { data: GroupRequest }) => createGroup(data),
        onError: () => {
            console.error("Failed to create group");
        },
    });
};

export const useUpdateGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            token,
            data,
        }: {
            token: string;
            data: GroupUpdateRequest;
        }) => updateGroup(token, data),
        onError: () => {
            console.error("Failed to update group");
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
