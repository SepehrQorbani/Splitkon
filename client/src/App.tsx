import React, { useEffect } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    useNavigationType,
    useLocation,
} from "react-router";
import Home from "./pages/Home";
import About from "./pages/About";
import MainLayout from "./layouts/MainLayout";
import ProgressBar from "./components/common/ProgressBar";
import { useUIStore } from "@/store";

const AppContent: React.FC = () => {
    const { startLoading, stopLoading } = useUIStore();
    const navigationType = useNavigationType();
    const location = useLocation();

    useEffect(() => {
        // Start loading on navigation
        startLoading();

        // Stop loading after a short delay (simulating transition)
        const timer = setTimeout(() => {
            stopLoading();
        }, 300); // Adjust as needed

        return () => clearTimeout(timer);
    }, [location, navigationType, startLoading, stopLoading]);

    return (
        <>
            <ProgressBar />
            <Routes>
                <Route
                    path="/"
                    element={
                        <MainLayout>
                            <Home />
                        </MainLayout>
                    }
                />
                <Route
                    path="/about"
                    element={
                        <MainLayout>
                            <About />
                        </MainLayout>
                    }
                />
                <Route path="*" element={<h1>404 - Not Found</h1>} />
            </Routes>
        </>
    );
};

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
};

export default App;
