import { NavItem } from "@/components/features/navigation/NavItem";
import { useTranslations } from "@/hooks/useTranslations";
import {
    IconCash,
    IconCashBanknoteFilled,
    IconCashPlus,
    IconDashboard,
    IconDashboardFilled,
    IconHome,
    IconHomeFilled,
    IconInfoSquareRounded,
    IconInfoSquareRoundedFilled,
    IconSettings,
    IconSquareRoundedPlus,
    IconSquareRoundedPlusFilled,
    IconTransfer,
    IconTransferIn,
    IconUsers,
} from "@tabler/icons-react";
import React from "react";
import { useParams } from "react-router";

export interface NavItem {
    path: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    activeIcon?: React.ComponentType<{ className?: string }>;
    className?: string;
}

interface NavItemsProps {
    items?: any;
    className?: string;
    hideLabels?: boolean;
    navType?: "main" | "group";
}

const getNavItems = (
    t: (key: string) => string,
    type: "main" | "group",
    token: string = ""
): NavItem[] =>
    type === "main"
        ? [
              {
                  path: "/about",
                  label: t("pages.about.title"),
                  icon: IconInfoSquareRounded,
                  activeIcon: IconInfoSquareRoundedFilled,
              },
              {
                  path: "/new",
                  label: t("pages.new.title"),
                  icon: IconSquareRoundedPlus,
                  activeIcon: IconSquareRoundedPlusFilled,
                  className: "ms-auto",
              },
          ]
        : [
              {
                  path: `${token}`,
                  label: t("ui.dashboard"),
                  icon: IconDashboard,
              },
              {
                  path: `${token}/members`,
                  label: t("ui.members"),
                  icon: IconUsers,
              },
              {
                  path: `${token}/expenses`,
                  label: t("ui.expenses"),
                  icon: IconCash,
              },
              {
                  path: `${token}/repays`,
                  label: t("ui.repays"),
                  icon: IconTransfer,
              },
              {
                  path: `${token}/setting`,
                  label: t("ui.settings"),
                  icon: IconSettings,
                  className: "ms-auto",
              },
          ];

export const NavItems: React.FC<NavItemsProps> = ({
    items,
    navType = "main",
}) => {
    const { t } = useTranslations();
    const { token } = useParams<{ token: string }>();

    const navItems = getNavItems(t, navType, token);
    return (
        <>
            {navItems.map((item) => (
                <NavItem
                    key={item.path}
                    to={item.path}
                    label={item.label}
                    icon={item.icon}
                    activeIcon={item.activeIcon}
                    className={item.className}
                    navType={navType}
                />
            ))}
        </>
    );
};
