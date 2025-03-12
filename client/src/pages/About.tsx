// client/src/pages/About.tsx
import React from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/utils/api";
import { useTranslations } from "@/hooks/useTranslations";
import { useUIStore } from "@/store";
const About: React.FC = () => {
    const language = useUIStore((state) => state.language);
    const { t, isLoading: isTransLoading } = useTranslations();
    const { data, isLoading, error } = useQuery({
        queryKey: ["aboutData", language],
        queryFn: fetchData,
    });

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {t("aboutTitle")}
            </h1>
            <p className="mt-4">
                {isLoading ? t("loading") : error ? t("error") : data?.message}
            </p>
            <nav className="mt-4">
                <Link
                    to="/"
                    className="text-blue-500 hover:underline dark:text-blue-400"
                >
                    {t("backToHome")}
                </Link>
            </nav>
        </div>
    );
};

export default About;
