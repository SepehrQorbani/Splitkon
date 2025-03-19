import React from "react";
import { NavLink } from "react-router";
import { cn } from "@/utils/cn";
import { motion } from "motion/react";

interface NavItemProps {
    to: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    layoutId: string;
    iconSize?: string;
}

export const NavItem: React.FC<NavItemProps> = ({
    to,
    label,
    icon: Icon,
    layoutId,
    iconSize = "w-4 h-4",
}) => {
    return (
        <NavLink className="relative" to={to}>
            {({ isActive }) => (
                <>
                    <div
                        className={cn(
                            "text-text-light hover:text-action flex items-center gap-1 p-2 relative text-sm z-10 transition-all duration-200",
                            layoutId.includes("desktop")
                                ? "px-2 py-1 hover:scale-[98%]"
                                : "p-2 hover:scale-95",
                            isActive && "hover:scale-100",
                            isActive &&
                                (layoutId.includes("desktop")
                                    ? "text-action"
                                    : "text-action-fg hover:text-action-fg")
                        )}
                    >
                        <Icon className={iconSize} />
                        {label}
                    </div>
                    {isActive && (
                        <motion.div
                            className={cn(
                                "absolute bg-action",
                                layoutId.includes("desktop")
                                    ? "rounded-md h-1 -bottom-4.5 left-0 right-0"
                                    : "rounded-full inset-0"
                            )}
                            layoutId={layoutId}
                            initial={false}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                            }}
                        />
                    )}
                </>
            )}
        </NavLink>
    );
};
