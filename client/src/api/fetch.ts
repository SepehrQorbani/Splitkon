// import { ZodSchema } from "zod";
import { useUIStore } from "@/store";

export const apiFetch = async <T>(
    url: string,
    options: RequestInit = {}
): Promise<T> => {
    const language = useUIStore.getState().language;
    const baseUrl =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
    const fullUrl = `${baseUrl}${url}`;

    const response = await fetch(fullUrl, {
        ...options,
        headers: {
            Accept: "application/json",
            "Accept-Language": language,
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        if (response.status === 404) {
            throw response;
        }
        const error = new Error(`Failed to fetch ${fullUrl}`);
        (error as any).cause = data;
        throw error;
    }

    return data as T;
};
