import { Navbar } from "@/components/features/navigation/Navbar";
import { useGroupStore } from "@/store";
import React, { useEffect } from "react";
import { Outlet, useParams } from "react-router";

const MainLayout: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const clearGroup = useGroupStore((state) => state.clearGroup);

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
