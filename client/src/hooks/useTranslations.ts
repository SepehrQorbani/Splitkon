import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUIStore } from "@/store";
import { fetchTranslations } from "@/utils/api";

export const useTranslations = () => {
    const { language, setLanguage, translations, direction } = useUIStore();
    const { data, isLoading } = useQuery({
        queryKey: ["translations", language],
        queryFn: () => fetchTranslations(language),
    });

    useEffect(() => {
        if (data) {
            useUIStore.setState({ translations: data });
        }
    }, [data]);

    const t = (key: string) => translations[key] || key;

    return { language, direction, setLanguage, t, isLoading };
};
