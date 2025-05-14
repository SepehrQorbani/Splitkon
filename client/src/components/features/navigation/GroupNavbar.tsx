//TODO: Fix active animation when scroll
import { NavLink } from "react-router";
import { NavItems } from "./NavItems";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { cn } from "@/utils/cn";

function GroupNavbar() {
    return (
        <nav
            className="sticky overflow-x-auto text-nowrap top-16 left-0 right-0 flex items-center justify-between px-4 py-2 min-h-16 bg-surface border-b border-border text-xs md:text-base z-99999"
            role="navigation"
            aria-label="Main navigation"
            // layoutRoot
            // layout
        >
            <motion.div
                className="sticky flex"
                layout
                layoutRoot
                // layoutId="group-nav-highlight"
            >
                <NavItems navType="group" />
            </motion.div>
        </nav>
    );
}

export default GroupNavbar;
