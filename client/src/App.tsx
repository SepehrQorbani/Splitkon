import React, { Suspense, lazy } from "react";
import { RouterProvider } from "react-aria-components";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { LoadingIndicator } from "./components/common/LoadingIndicator";
import GroupLayout from "./layouts/GroupLayout";
import MainLayout from "./layouts/MainLayout";
import MainError from "./pages/MainError";
import ExpensesIndex from "./pages/expenses/Index";
import Dashboard from "./pages/group/Dashboard";
import MembersIndex from "./pages/members/Index";
import NotFound from "./pages/NotFound";
import RepaysIndex from "./pages/repays";
import SettingsIndex from "./pages/settings";

// Lazy-loaded components
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const NewGroup = lazy(() => import("./pages/group/New"));

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
                    </Route>
                    <Route path="/" element={<GroupLayout />}>
                        <Route path=":token" element={<Dashboard />} />
                        <Route
                            path=":token/members"
                            element={<MembersIndex />}
                        />
                        <Route
                            path=":token/expenses"
                            element={<ExpensesIndex />}
                        />
                        <Route path=":token/repays" element={<RepaysIndex />} />
                        <Route
                            path=":token/setting"
                            element={<SettingsIndex />}
                        />
                        <Route path=":token/*" element={<NotFound />} />
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
            <ErrorBoundary fallback={<MainError />}>
                <AppContent />
            </ErrorBoundary>
        </BrowserRouter>
    );
};

export default App;
