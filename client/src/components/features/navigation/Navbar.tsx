import MobileMenu from "@/components/features/navigation/MobileMenu";
import { NavItems } from "@/components/features/navigation/NavItems";
import UiConfigMenu from "@/components/features/navigation/UiConfigMenu";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/utils/cn";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { NavLink } from "react-router";
import RecentGroupMenu from "./RecentGroupMenu";

export const Navbar = ({ layout }: { layout: "main" | "group" }) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const { scrollY } = useScroll();
    const [isScroll, setIsScroll] = useState(false);

    useMotionValueEvent(scrollY, "change", (current) => {
        setIsScroll(current > 20 ? true : current === 0 ? false : isScroll);
    });

    return (
        <>
            <nav
                className={cn(
                    "sticky transition-all duration-200 border-b top-0 left-0 right-0 flex items-center justify-between px-4 py-2 min-h-16 text-xs md:text-base z-99999",
                    isScroll && layout === "main"
                        ? "bg-surface/90 backdrop-blur-xs rounded border border-border shadow-md mx-1 top-1"
                        : "bg-surface/0 border-transparent",
                    isScroll && layout === "group" && "min-h-12 py-1",
                    layout === "group" && "bg-surface border-border"
                )}
                role="navigation"
                aria-label="Main navigation"
            >
                <div className="flex items-center gap-2 w-full me-2 relative">
                    <NavLink
                        to="/"
                        className="text-brand font-bold flex items-center text-nowrap"
                    >
                        <svg
                            viewBox="0 0 500 500"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 me-2"
                            fill="currentColor"
                        >
                            <path d="M301.948 5.00001C320.746 5.00001 332.246 25.6307 322.362 41.6197L49.4142 483.153C36.7028 503.716 5 494.708 5 470.534L5.00002 29C5.00002 15.7452 15.7452 5 29 5L301.948 5.00001Z" />
                            <path d="M450.586 16.8466C463.297 -3.71597 495 5.29207 495 29.4664L495 471C495 484.255 484.255 495 471 495H198.052C179.254 495 167.754 474.369 177.638 458.38L450.586 16.8466Z" />
                        </svg>
                        <span>اسپلیت کن</span>
                    </NavLink>
                    {isDesktop && <NavItems />}
                </div>
                <div className="flex items-center gap-2">
                    {isDesktop ? (
                        <>
                            <RecentGroupMenu />
                            <UiConfigMenu />
                        </>
                    ) : (
                        <MobileMenu />
                    )}
                </div>
            </nav>
        </>
    );
};
