import React from "react";
import { NavLink } from "react-router";
import { cn } from "@/utils/cn";
import { motion } from "motion/react";

interface NavItemProps {
    to: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    activeIcon?: React.ComponentType<{ className?: string }>;
    className?: string;
    layoutId: string;
}

export const NavItem: React.FC<NavItemProps> = ({
    to,
    label,
    icon: Icon,
    activeIcon: ActiveIcon,
    className,
    layoutId,
}) => {
    return (
        <NavLink to={to} className={cn("block", className)} end>
            {({ isActive }) => (
                <div
                    className={cn(
                        "relative px-2",
                        isActive && "text-action-fg"
                    )}
                >
                    {isActive && (
                        <motion.div
                            className={cn("absolute bg-action rounded inset-0")}
                            layoutId={layoutId}
                            initial={false}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                            }}
                        />
                    )}
                    <div className="flex gap-1 items-center p-2 rounded relative">
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
