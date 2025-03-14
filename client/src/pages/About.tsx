// client/src/pages/About.tsx
import React from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/utils/api";
import { useTranslations } from "@/hooks/useTranslations";
import { useUIStore } from "@/store";
import { LoadingWrapper } from "@/components/ui/LoadingWrapper";

const About: React.FC = () => {
    const language = useUIStore((state) => state.language);
    const { t } = useTranslations();
    const { data, isLoading, error } = useQuery({
        queryKey: ["aboutData", language],
        queryFn: fetchData,
    });
    return (
        <LoadingWrapper isLoading={isLoading} t={t}>
            <div className="p-4 border border-border rounded-lg">
                <h1 className="text-3xl font-bold">{t("aboutTitle")}</h1>
                <p className="mt-4">
                    {isLoading
                        ? t("loading")
                        : error
                        ? t("error")
                        : data?.message}
                </p>

                <nav className="mt-4">
                    <Link to="/" className="hover:underline">
                        {t("backToHome")}
                    </Link>
                </nav>
            </div>
        </LoadingWrapper>
    );
};

export default About;
