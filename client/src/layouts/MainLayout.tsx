import { LoadingIndicator } from "@/components/ui/LoadingIndicator";
import { Navbar } from "@/components/ui/Navbar";
import { useTranslations } from "@/hooks/useTranslations";
import React from "react";
import { Outlet } from "react-router";

const MainLayout: React.FC = () => {
    const { isLoading: isTransLoading } = useTranslations();

    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="p-4 pb-16 md:pb-0">
                {isTransLoading ? (
                    <LoadingIndicator size="md" className="me-2" />
                ) : (
                    <Outlet />
                )}
            </main>
        </div>
    );
};
export default MainLayout;
