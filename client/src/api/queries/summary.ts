import { queryKeys } from "@/api/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { getSummary } from "../endpoints/summary";

export const useGetSummary = (token: string) => {
    return useQuery({
        queryKey: queryKeys.summary(token),
        queryFn: () => getSummary(token),
        enabled: !!token,
        placeholderData: (previousData) => previousData,
    });
};
