import { useQuery } from "@tanstack/react-query";
import { getBalance } from "@/api/endpoints/balance";
import { queryKeys } from "@/api/queryKeys";

export const useGetBalance = (token: string) => {
    return useQuery({
        queryKey: queryKeys.balance(token),
        queryFn: () => getBalance(token),
        enabled: !!token,
        placeholderData: (previousData) => previousData,
    });
};
