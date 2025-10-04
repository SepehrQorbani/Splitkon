import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useModalRouterSync } from "@/hooks/useModalRouterSync";
import ActionMenu from "@/pages/group/ActionMenu";
import { useModalStore } from "@/store/modals";
import { cn } from "@/utils/cn";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { NavItems } from "./NavItems";

function GroupNavbar() {
    const { scrollY } = useScroll();
    const [isScroll, setIsScroll] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const openModal = useModalStore((state) => state.openModal);

    useModalRouterSync();
    useMotionValueEvent(scrollY, "change", (current) => {
        setIsScroll(current > 20 ? true : current === 0 ? false : isScroll);
    });

    return (
        <>
            {isDesktop ? (
                <nav
                    className={cn(
                        "sticky transition-all duration-200 overflow-x-auto text-nowrap top-16 left-0 right-0 flex items-center justify-between px-4 py-2 min-h-12 bg-surface border-b border-border text-xs md:text-base z-99999",
                        isScroll && "top-12 shadow-input"
                    )}
                    role="navigation"
                    aria-label="Main navigation"
                >
                    <motion.div className="sticky flex" layout layoutRoot>
                        <NavItems navType="group" />
                    </motion.div>
                    <ActionMenu />
                </nav>
            ) : (
                <ActionMenu />
            )}
        </>
    );
}

export default GroupNavbar;
