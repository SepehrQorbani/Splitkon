import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuthStore } from "@/store";
import { useUIStore } from "@/store";
import { fetchData } from "@/utils/api";

const Home: React.FC = () => {
    const { isAuthenticated, login, logout } = useAuthStore();
    const { startLoading, stopLoading } = useUIStore();
    const [data, setData] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            startLoading(); // Start progress bar
            try {
                const result = await fetchData();
                setData(result.message);
            } catch (error) {
                console.error("API fetch error:", error);
                setData("Failed to load data");
            } finally {
                stopLoading(); // Stop progress bar
            }
        };

        loadData();
    }, [startLoading, stopLoading]);

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                Home Page
            </h1>
            <p className="mt-2">
                Authenticated:{" "}
                <span className="font-semibold">
                    {isAuthenticated ? "Yes" : "No"}
                </span>
            </p>
            <div className="mt-4 space-x-4">
                <button
                    onClick={login}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                >
                    Login
                </button>
                <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                >
                    Logout
                </button>
            </div>
            <p className="mt-4">{data || "Loading..."}</p>
            <nav className="mt-4">
                <Link
                    to="/about"
                    className="text-blue-500 hover:underline dark:text-blue-400"
                >
                    Go to About
                </Link>
            </nav>
        </div>
    );
};

export default Home;
