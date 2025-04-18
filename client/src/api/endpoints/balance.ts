import { BalanceResponse } from "@/types/api/balance";
import { apiFetch } from "../fetch";

export const getBalance = async (token: string): Promise<BalanceResponse> => {
    return apiFetch<BalanceResponse>(`/api/groups/${token}/balance`, {
        method: "GET",
    });
};
