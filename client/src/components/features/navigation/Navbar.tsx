import MobileMenu from "@/components/features/navigation/MobileMenu";
import SettingMenu from "@/components/features/navigation/SettingMenu";
import { NavItems } from "@/components/features/navigation/NavItems";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import React from "react";
import { NavLink } from "react-router";
import { motion } from "motion/react";

export const Navbar: React.FC = () => {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    return (
        <>
            <nav
                className="sticky top-0 left-0 right-0 flex items-center justify-between px-4 py-2 min-h-16 bg-surface border-b border-border text-xs md:text-base z-99999"
                role="navigation"
                aria-label="Main navigation"
            >
                <div className="flex items-center gap-2 w-full me-2 relative">
                    <NavLink
                        to="/"
                        className="text-brand font-bold flex items-center text-nowrap"
                    >
                        <svg
                            viewBox="0 0 260 390"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-full h-6 me-2"
                        >
                            <path
                                d="M215.815 121.45C228.454 100.843 260 109.863 260 134.084L260 365.958C260 379.236 249.311 390 236.126 390L93.9115 390C75.2171 390 63.776 369.342 73.5998 353.325L215.815 121.45Z"
                                fill="currentColor"
                            />
                            <path
                                d="M166.089 -1.0452e-06C184.783 -2.28045e-07 196.224 20.6584 186.4 36.6755L44.1853 268.55C31.5462 289.157 5.22288e-06 280.137 6.28162e-06 255.916L1.64172e-05 24.0417C1.69976e-05 10.7638 10.6886 -7.83795e-06 23.8737 -7.26161e-06L166.089 -1.0452e-06Z"
                                fill="currentColor"
                            />
                        </svg>
                        <span>اسپلیت کن</span>
                    </NavLink>
                    {isDesktop && <NavItems />}
                </div>
                <div className="flex items-center gap-2">
                    {isDesktop ? <SettingMenu /> : <MobileMenu />}
                </div>
            </nav>
        </>
    );
};
