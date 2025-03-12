// client/src/pages/Home.tsx
import React from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore, useUIStore } from "@/store";
import { fetchData } from "@/utils/api";
import { useTranslations } from "@/hooks/useTranslations";

const Home: React.FC = () => {
    const { isAuthenticated, login, logout } = useAuthStore();
    const language = useUIStore((state) => state.language);
    const { t, isLoading: isTransLoading } = useTranslations();
    const { data, isLoading } = useQuery({
        queryKey: ["homeData", language],
        queryFn: fetchData,
    });

    if (isTransLoading) return <p>Loading translations...</p>;

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {t("homeTitle")}
            </h1>
            <p className="mt-2">
                {t("authenticated")}:{" "}
                <span className="font-semibold">
                    {isAuthenticated ? t("yes") : t("no")}
                </span>
            </p>
            <div className="mt-4 space-x-4">
                <button
                    onClick={login}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    {t("login")}
                </button>
                <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    {t("logout")}
                </button>
            </div>
            <p className="mt-4">{isLoading ? t("loading") : data?.message}</p>
            <nav className="mt-4">
                <Link
                    to="/about"
                    className="text-blue-500 hover:underline dark:text-blue-400"
                >
                    {t("goToAbout")}
                </Link>
            </nav>
        </div>
    );
};

export default Home;
