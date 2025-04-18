import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router";
import { RouterProvider } from "react-aria-components";
import MainLayout from "./layouts/MainLayout";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { LoadingIndicator } from "./components/common/LoadingIndicator";

// Lazy-loaded components
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const NewGroup = lazy(() => import("./pages/group/New"));
const GroupIndex = lazy(() => import("./pages/group/Index"));

const NotFound = () => (
    <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold text-gray-800">404 - Not Found</h1>
        <p className="mt-2 text-gray-600">
            The page you're looking for doesn't exist.
        </p>
    </div>
);

// Loading fallback component
const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-screen">
        <LoadingIndicator />
    </div>
);

const AppContent = () => {
    const navigate = useNavigate();

    return (
        <RouterProvider navigate={navigate}>
            <Suspense fallback={<LoadingFallback />}>
                <Routes>
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<Home />} />
                        <Route path="about" element={<About />} />
                        <Route path="new" element={<NewGroup />} />
                        <Route path=":token/*" element={<GroupIndex />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </RouterProvider>
    );
};

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <ErrorBoundary
                fallback={<div>مشکلی پیش اومد! لطفاً دوباره امتحان کنید.</div>}
            >
                <AppContent />
            </ErrorBoundary>
        </BrowserRouter>
    );
};

export default App;
