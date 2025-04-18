import { apiFetch } from "@/api/fetch";
import {
    RepayRequest,
    RepayResponse,
    RepaysResponse,
} from "@/types/api/repays";

export const createRepay = async (
    token: string,
    data: RepayRequest
): Promise<RepayResponse> => {
    return apiFetch<RepayResponse>(`/api/groups/${token}/repays`, {
        method: "POST",
        body: JSON.stringify(data),
    });
};

export const updateRepay = async (
    token: string,
    repay_id: number,
    data: RepayRequest
): Promise<RepayResponse> => {
    return apiFetch<RepayResponse>(`/api/groups/${token}/repays/${repay_id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
};

export const getRepay = async (
    token: string,
    id: string
): Promise<RepayResponse> => {
    return apiFetch<RepayResponse>(`/api/groups/${token}/repays/${id}`, {
        method: "GET",
    });
};

export const getRepays = async (token: string): Promise<RepaysResponse> => {
    return apiFetch<RepaysResponse>(`/api/groups/${token}/repays`, {
        method: "GET",
    });
};
