import { Navbar } from "@/components/features/navigation/Navbar";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import { useTranslations } from "@/hooks/useTranslations";
import { useGroupStore } from "@/store";
import React, { useEffect } from "react";
import { Outlet, useLocation, useParams } from "react-router";

const MainLayout: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const { pathname } = useLocation();
    const clearGroup = useGroupStore((state) => state.clearGroup);
    const { t } = useTranslations();

    useDocumentTitle(
        pathname.replaceAll("/", "").length > 0
            ? t(`pages.${pathname.replaceAll("/", "")}.title`)
            : ""
    );

    useEffect(() => {
        if (!token) {
            clearGroup();
        }
    }, [token]);

    return (
        <div className="min-h-screen">
            <Navbar layout="main" />
            <main className="p-4 pb-16 md:pb-0">
                <Outlet />
            </main>
        </div>
    );
};
export default MainLayout;
