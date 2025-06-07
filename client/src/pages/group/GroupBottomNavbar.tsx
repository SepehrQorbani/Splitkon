import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/utils/cn";
import {
    IconCash,
    IconDashboard,
    IconTransfer,
    IconUsers,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import React, { ReactNode } from "react";
import { NavLink, useParams } from "react-router";
import ActionMenuButtons from "./ActionMenuButtons";
import { ActionButton } from "./ActionMenuButtons";

type NavItem =
    | {
          type: "link";
          path: string;
          label: string;
          icon: React.ComponentType<{ className?: string }>;
          className?: string;
      }
    | { type: "actions"; actions: ActionButton[] };

interface MobileNavItemProps {
    item: Extract<NavItem, { type: "link" }>;
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({ item }) => (
    <NavLink
        to={item.path}
        className={cn("block flex-1 shrink-0 text-center", item.className)}
        end
    >
        {({ isActive }) => (
            <div className="flex flex-col gap-1 items-center p-2 rounded relative text-[10px] font-light">
                <AnimatePresence>
                    {isActive && (
                        <motion.div
                            className={cn(
                                "absolute top-0 h-1 w-6 bg-action rounded-full"
                            )}
                            initial={{
                                opacity: 0,
                                scale: 0.5,
                                y: 2,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                            }}
                            exit={{
                                y: 2,
                                opacity: 0,
                                scale: 0.5,
                            }}
                        />
                    )}
                </AnimatePresence>
                <item.icon className="size-4" />
                <span>{item.label}</span>
            </div>
        )}
    </NavLink>
);

interface GroupBottomNavbarProps {
    actionButtons: ActionButton[];
}

export const GroupBottomNavbar: React.FC<GroupBottomNavbarProps> = ({
    actionButtons,
}) => {
    const { t } = useTranslations();
    const { token } = useParams<{ token: string }>();

    if (!token) return null;

    const navItems: NavItem[] = [
        {
            type: "link",
            path: `${token}`,
            label: t("ui.dashboard"),
            icon: IconDashboard,
        },
        {
            type: "link",
            path: `${token}/members`,
            label: t("ui.members"),
            icon: IconUsers,
        },
        {
            type: "actions",
            actions: actionButtons,
        },
        {
            type: "link",
            path: `${token}/expenses`,
            label: t("ui.expenses"),
            icon: IconCash,
        },
        {
            type: "link",
            path: `${token}/repays`,
            label: t("ui.repays"),
            icon: IconTransfer,
        },
    ];

    return (
        <div className="flex fixed bottom-0 left-0 right-0 bg-surface border-t border-border px-2 justify-around md:hidden z-99999">
            {navItems.map((item) => {
                switch (item.type) {
                    case "actions":
                        return (
                            <ActionMenuButtons
                                key="action-menu"
                                actions={item.actions}
                            />
                        );
                    case "link":
                        return <MobileNavItem key={item.path} item={item} />;
                }
            })}
        </div>
    );
};
