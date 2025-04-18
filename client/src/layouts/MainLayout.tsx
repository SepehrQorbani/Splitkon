import { Navbar } from "@/components/features/navigation/Navbar";
import { useTranslations } from "@/hooks/useTranslations";
import React from "react";
import { Outlet } from "react-router";

const MainLayout: React.FC = () => {
    useTranslations();

    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="p-4 pb-16 md:pb-0">
                <Outlet />
            </main>
        </div>
    );
};
export default MainLayout;
