import { useUIStore } from "@/store";

// export const fetchTranslations = async (
//     locale: string
// ): Promise<Record<string, string>> => {
//     const response = await fetch(`/api/translations/${locale}`, {
//         headers: { Accept: "application/json" },
//     });
//     if (!response.ok) throw new Error("Failed to fetch translations");
//     return response.json();
// };

// export const fetchData = async (): Promise<{ message: string }> => {
//     const response = await fetch("/api/data", {
//         headers: {
//             Accept: "application/json",
//         },
//     });
//     if (!response.ok) throw new Error("Failed to fetch data");
//     return response.json();
// };

const apiFetch = async (url: string, options: RequestInit = {}) => {
    const language = useUIStore.getState().language;
    const response = await fetch(url, {
        ...options,
        headers: {
            Accept: "application/json",
            "Accept-Language": language,
            ...options.headers,
        },
    });
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);
    return response.json();
};

export const fetchTranslations = (locale: string) =>
    apiFetch(`/api/translations/${locale}`);
export const fetchData = () => apiFetch("/api/data");

// export const fetchData = async (): Promise<{ message: string }> => {
//     const language = useUIStore((state) => state.language);
//     const response = await fetch("/api/data", {
//         headers: {
//             Accept: "application/json",
//             "Accept-Language": language, // ارسال زبان به سرور
//         },
//     });
//     if (!response.ok) throw new Error("Failed to fetch data");
//     return response.json();
// };

// export const fetchData = async (): Promise<{
//     message: string;
//     fetchDuration: number;
// }> => {
//     console.log("fetchData called");
//     const startTime = performance.now();
//     const response = await fetch("/api/data", {
//         headers: { Accept: "application/json" },
//     });
//     if (!response.ok) throw new Error("Failed to fetch data");
//     const data = await response.json();
//     const endTime = performance.now();
//     const fetchDuration = (endTime - startTime) / 1000;
//     return { ...data, fetchDuration };
// };
