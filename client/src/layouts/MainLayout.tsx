import { useUIStore } from "@/store";
import React from "react";
import { Outlet } from "react-router";

const MainLayout: React.FC = () => {
    const language = useUIStore((state) => state.language);
    const setLanguage = useUIStore((state) => state.setLanguage);
    const theme = useUIStore((state) => state.theme);
    const setTheme = useUIStore((state) => state.setTheme);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <header className="p-4 bg-blue-500 text-white flex justify-between items-center">
                <h1 className="text-xl font-bold">برنامه من</h1>
                <div className="flex gap-6">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setLanguage("en")}
                            className={`px-2 py-1 rounded ${
                                language === "en"
                                    ? "bg-blue-700"
                                    : "bg-blue-600"
                            } hover:bg-blue-700`}
                        >
                            English
                        </button>
                        <button
                            onClick={() => setLanguage("fa")}
                            className={`px-2 py-1 rounded ${
                                language === "fa"
                                    ? "bg-blue-700"
                                    : "bg-blue-600"
                            } hover:bg-blue-700`}
                        >
                            فارسی
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setTheme("light")}
                            className={`px-2 py-1 rounded ${
                                theme === "light"
                                    ? "bg-blue-700"
                                    : "bg-blue-600"
                            } hover:bg-blue-700`}
                        >
                            Light
                        </button>
                        <button
                            onClick={() => setTheme("dark")}
                            className={`px-2 py-1 rounded ${
                                theme === "dark" ? "bg-blue-700" : "bg-blue-600"
                            } hover:bg-blue-700`}
                        >
                            Dark
                        </button>
                        <button
                            onClick={() => setTheme("system")}
                            className={`px-2 py-1 rounded ${
                                theme === "system"
                                    ? "bg-blue-700"
                                    : "bg-blue-600"
                            } hover:bg-blue-700`}
                        >
                            System
                        </button>
                    </div>
                </div>
            </header>
            <main className="p-4">
                <Outlet />
            </main>
        </div>
    );
};
export default MainLayout;

// client/src/layouts/MainLayout.tsx
// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import { useUIStore } from '@/store';

// const MainLayout: React.FC = () => {
//     const { language, setLanguage } = useUIStore();

//     return (
//         <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
//             <header className="p-4 bg-blue-500 text-white flex justify-between items-center">
//                 <h1 className="text-xl font-bold">برنامه من</h1>
//                 <div>
//                     <button
//                         onClick={() => setLanguage('en')}
//                         className={`px-2 py-1 rounded ${language === 'en' ? 'bg-blue-700' : 'bg-blue-600'} hover:bg-blue-700`}
//                     >
//                         English
//                     </button>
//                     <button
//                         onClick={() => setLanguage('fa')}
//                         className={`px-2 py-1 rounded ${language === 'fa' ? 'bg-blue-700' : 'bg-blue-600'} hover:bg-blue-700 mr-2`}
//                     >
//                         فارسی
//                     </button>
//                 </div>
//             </header>
//             <main className="p-4">
//                 <Outlet />
//             </main>
//         </div>
//     );
// };

// export default MainLayout;
