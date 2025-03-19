import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import About from "./pages/About";
import MainLayout from "./layouts/MainLayout";
import New from "./pages/group/New";
import Index from "./pages/group/Index";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            {/* <LoadingIndicator /> */}
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="/new" element={<New />} />
                    <Route path="/:token" element={<Index />} />
                </Route>
                <Route path="*" element={<h1>404 - Not Found</h1>} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
