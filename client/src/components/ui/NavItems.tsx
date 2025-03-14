import React from "react";
import { cn } from "@/utils/cn";
import { NavItem } from "@/components/ui/NavItem";

interface NavItemData {
    path: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}

interface NavItemsProps {
    navItems: NavItemData[];
    layoutId: string;
    className?: string;
    iconSize?: string;
    hideLabels?: boolean;
}

export const NavItems: React.FC<NavItemsProps> = ({
    navItems,
    layoutId,
    className,
    iconSize = "w-4 h-4",
    hideLabels = false,
}) => {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            {navItems.map((item) => (
                <NavItem
                    key={item.path}
                    to={item.path}
                    label={hideLabels ? "" : item.label}
                    icon={item.icon}
                    layoutId={layoutId}
                    iconSize={iconSize}
                />
            ))}
        </div>
    );
};
