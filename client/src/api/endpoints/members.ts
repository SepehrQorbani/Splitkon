import { apiFetch } from "@/api/fetch";
import {
    MemberRequest,
    MemberResponse,
    MembersResponse,
} from "@/types/api/members";

export const createMember = async (
    token: string,
    data: MemberRequest
): Promise<MemberResponse> => {
    return apiFetch<MemberResponse>(`/api/groups/${token}/members`, {
        method: "POST",
        body: JSON.stringify(data),
    });
};

export const updateMember = async (
    token: string,
    member_id: number,
    data: MemberRequest
): Promise<MemberResponse> => {
    return apiFetch<MemberResponse>(
        `/api/groups/${token}/members/${member_id}`,
        {
            method: "PATCH",
            body: JSON.stringify(data),
        }
    );
};

export const deleteMember = async (
    token: string,
    id: MemberRequest["id"]
): Promise<MembersResponse> => {
    return apiFetch<MembersResponse>(`/api/groups/${token}/members/${id}`, {
        method: "DELETE",
    });
};

export const getMembers = async (token: string): Promise<MembersResponse> => {
    return apiFetch<MembersResponse>(`/api/groups/${token}/members`, {
        method: "GET",
    });
};
