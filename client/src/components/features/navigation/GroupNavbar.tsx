import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { NavItems } from "./NavItems";
import { cn } from "@/utils/cn";

function GroupNavbar() {
    const { scrollY } = useScroll();
    const [isScroll, setIsScroll] = useState(false);

    useMotionValueEvent(scrollY, "change", (current) => {
        setIsScroll(current > 0);
    });
    return (
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
        </nav>
    );
}

export default GroupNavbar;
