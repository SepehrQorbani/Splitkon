import { Button } from "@/components/ui/Button";
import { useTranslations } from "@/hooks/useTranslations";
import { useUIStore } from "@/store";
import {
    IconHome,
    IconInfoCircle,
    IconLanguage,
    IconMoon,
    IconSquareRoundedPlus,
    IconSun,
} from "@tabler/icons-react";
import React from "react";
import { NavLink } from "react-router"; // Changed to NavLink, kept react-router per your setup
import { NavItems } from "./NavItems";

export const Navbar: React.FC = () => {
    const { language, setLanguage, theme, setTheme } = useUIStore();
    const { t } = useTranslations();

    const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
    const toggleLanguage = () => setLanguage(language === "en" ? "fa" : "en");

    const navItems = [
        { path: "/", label: t("pages.home.title"), icon: IconHome },
        { path: "/about", label: t("pages.about.title"), icon: IconInfoCircle },
        {
            path: "/new",
            label: t("pages.new.title"),
            icon: IconSquareRoundedPlus,
        },
    ];

    return (
        <>
            {/* Top Navbar (Sticky) */}
            <nav className="sticky top-0 left-0 right-0 flex items-center justify-between px-4 py-2 min-h-16 bg-surface border-b border-border text-xs md:text-base z-999999">
                <div className="flex items-center gap-4">
                    <NavLink to="/" className="text-brand text-xl font-bold">
                        MyApp
                    </NavLink>
                    {/* Desktop Navigation Links */}
                    <NavItems
                        navItems={navItems}
                        layoutId="nav-highlight-desktop"
                        className="hidden md:flex"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        onPress={toggleTheme}
                        variant="ghost"
                        intent="primary"
                        size="sm"
                    >
                        {theme === "dark" ? (
                            <IconSun className="w-4 h-4" />
                        ) : (
                            <IconMoon className="w-4 h-4" />
                        )}
                    </Button>
                    <Button
                        onPress={toggleLanguage}
                        variant="ghost"
                        intent="primary"
                        size="sm"
                    >
                        <IconLanguage className="w-4 h-4" />
                        {language === "en" ? "فارسی" : "English"}
                    </Button>
                </div>
            </nav>

            {/* Bottom Navigation (Mobile Only, Always Visible) */}
            <NavItems
                navItems={navItems}
                layoutId="nav-highlight-mobile"
                className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-2 justify-around md:hidden z-999999"
                iconSize="w-6 h-6"
                hideLabels
            />
        </>
    );
};
