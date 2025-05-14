import { apiFetch } from "@/api/fetch";
import {
    GroupRequest,
    GroupResponse,
    GroupUpdateRequest,
} from "@/types/api/group";

export const createGroup = async (
    data: GroupRequest
): Promise<GroupResponse> => {
    return apiFetch<GroupResponse>("/api/groups", {
        method: "POST",
        body: JSON.stringify(data),
    });
};

export const getGroup = async (token: string): Promise<GroupResponse> => {
    return apiFetch<GroupResponse>(`/api/groups/${token}`, {
        method: "GET",
    });
};

export const updateGroup = async (
    token: string,
    data: GroupUpdateRequest
): Promise<GroupResponse> => {
    return apiFetch<GroupResponse>(`/api/groups/${token}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
};
