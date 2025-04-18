import { SummaryResponse } from "@/types/api/summary";
import { apiFetch } from "../fetch";

export async function getSummary(token: string): Promise<SummaryResponse> {
    const data = await apiFetch<SummaryResponse>(
        `/api/groups/${token}/summary`,
        {
            method: "GET",
        }
    );
    return data;
}
