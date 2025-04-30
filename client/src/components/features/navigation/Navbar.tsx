import MobileMenu from "@/components/features/navigation/MobileMenu";
import SettingMenu from "@/components/features/navigation/SettingMenu";
import { NavItems } from "@/components/features/navigation/NavItems";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import React from "react";
import { NavLink } from "react-router";

export const Navbar: React.FC = () => {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    return (
        <>
            <nav
                className="sticky top-0 left-0 right-0 flex items-center justify-between px-4 py-2 min-h-16 bg-surface border-b border-border text-xs md:text-base z-99999"
                role="navigation"
                aria-label="Main navigation"
            >
                <div className="flex items-center gap-2 w-full me-2">
                    <NavLink to="/" className="text-brand text-xl font-bold">
                        SplitKon
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
