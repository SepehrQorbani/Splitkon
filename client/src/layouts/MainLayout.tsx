import { useUIStore } from "@/store";
import React from "react";
import { motion } from "motion/react";

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const { isDarkMode, toggleDarkMode } = useUIStore();

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">My App</h2>
                <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 focus:outline-none cursor-pointer"
                    aria-label="Toggle dark mode"
                >
                    {isDarkMode ? (
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                        </svg>
                    ) : (
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                            />
                        </svg>
                    )}
                </button>
            </header>
            <main className="flex-grow p-4">{children}</main>
            <footer className="bg-gray-200 dark:bg-gray-800 p-4 text-center text-gray-600 dark:text-gray-300">
                <p>Footer Content</p>
            </footer>
        </div>
    );
};

export default MainLayout;
