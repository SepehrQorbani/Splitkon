import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useUIStore } from "@/store";
import { fetchData } from "@/utils/api";

const About: React.FC = () => {
    const { startLoading, stopLoading } = useUIStore();
    const [data, setData] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            startLoading();
            try {
                const result = await fetchData();
                setData(result.message);
            } catch (error) {
                console.error("API fetch error:", error);
                setData("Failed to load data");
            } finally {
                stopLoading();
            }
        };

        loadData();
    }, [startLoading, stopLoading]);

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                About Page
            </h1>
            <p className="mt-4">{data || "Loading..."}</p>
            <nav className="mt-4">
                <Link
                    to="/"
                    className="text-blue-500 hover:underline dark:text-blue-400"
                >
                    Back to Home
                </Link>
            </nav>
        </div>
    );
};

export default About;
