import { useUIStore } from "@/store";
import { Group, Member } from "./schema";

const apiFetch = async (url: string, options: RequestInit = {}) => {
    const language = useUIStore.getState().language;
    const response = await fetch(url, {
        ...options,
        headers: {
            Accept: "application/json",
            "Accept-Language": language,
            "Content-Type": "application/json",
            ...options.headers,
        },
    });
    if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(`Failed to fetch ${url}`);
        (error as any).cause = errorData; // Attach error details
        throw error;
    }
    return response.json();
};

export const createGroup = async (
    data: Group
): Promise<{ data: Group & { view_token: string; edit_token: string } }> => {
    return apiFetch("/api/create", {
        method: "POST",
        body: JSON.stringify(data),
    });
};

export interface GetGroupResponse {
    data: {
        title: string;
        description: string;
        members: {
            id: string;
            name: string;
            avatar: string;
            ratio: number;
            bank_info?: string;
        }[];
        view_token: string;
        edit_token: string | null;
    };
}
export const getGroup = async (token: string): Promise<GetGroupResponse> => {
    return apiFetch(`/api/groups/${token}`, {
        method: "GET",
    });
};

export const createMember = async (member: Member): Promise<Member> => {
    return apiFetch("/api/members", {
        method: "POST",
        body: JSON.stringify(member),
    });
};

export const updateMember = async (member: Member): Promise<Member> => {
    return apiFetch(`/api/members/${member.id}`, {
        method: "PUT",
        body: JSON.stringify(member),
    });
};

export const deleteMember = async (id: string | number): Promise<void> => {
    await apiFetch(`/api/members/${id}`, {
        method: "DELETE",
    });
};

//sample data
export const fetchData = () => apiFetch("/api/data");
