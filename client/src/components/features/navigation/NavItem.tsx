import React from "react";
import { NavLink } from "react-router";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "motion/react";

interface NavItemProps {
    to: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    activeIcon?: React.ComponentType<{ className?: string }>;
    className?: string;
    navType: "main" | "group";
}

export const NavItem: React.FC<NavItemProps> = ({
    to,
    label,
    icon: Icon,
    activeIcon: ActiveIcon,
    className,
    navType = "main",
}) => {
    return (
        <NavLink to={to} className={cn("block", className)} end>
            {({ isActive }) => (
                <div
                    className={cn(
                        "relative px-2 text-action/75",
                        isActive && "text-action"
                    )}
                >
                    {isActive && navType === "group" ? (
                        <motion.div
                            className={cn(
                                "absolute bg-action rounded -bottom-2 left-0 right-0 h-0.5"
                            )}
                            layoutId={`${navType}-nav-highlight`}
                            initial={false}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                            }}
                        />
                    ) : (
                        <AnimatePresence>
                            {isActive && (
                                <motion.div
                                    className={cn(
                                        "absolute bg-action rounded inset-0"
                                    )}
                                    initial={{
                                        opacity: 0,
                                        scale: 0.5,
                                        y: 4,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        y: 0,
                                    }}
                                    exit={{
                                        y: 4,
                                        opacity: 0,
                                        scale: 0.5,
                                    }}
                                />
                            )}
                        </AnimatePresence>
                    )}

                    <div
                        className={cn(
                            "flex gap-1 items-center p-2 rounded relative text-sm",
                            isActive && navType !== "group" && "text-action-fg"
                        )}
                    >
                        {isActive && ActiveIcon ? (
                            <ActiveIcon className="size-4" />
                        ) : (
                            <Icon className="size-4" />
                        )}
                        <span>{label}</span>
                    </div>
                </div>
            )}
        </NavLink>
    );
};
