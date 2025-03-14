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
                            "text-text hover:text-brand flex items-center gap-1 p-2 relative z-10",
                            isActive && "text-brand",
                            layoutId.includes("desktop") ? "px-2 py-1" : "p-2"
                        )}
                    >
                        <Icon className={iconSize} />
                        {label}
                    </div>
                    {isActive && (
                        <motion.div
                            className={cn(
                                "absolute inset-0 bg-brand/20",
                                layoutId.includes("desktop")
                                    ? "rounded-md"
                                    : "rounded-full"
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
