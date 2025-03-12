import { create } from "zustand";

type Language = "fa" | "en";
type Direction = "rtl" | "ltr";
type Theme = "dark" | "light" | "system";

interface UIState {
    language: Language;
    direction: Direction;
    translations: Record<string, string>;
    theme: Theme;
    setTheme: (theme: Theme) => void;
    setLanguage: (lang: Language) => void;
}

export const useUIStore = create<UIState>((set) => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const savedLang = localStorage.getItem("language") as Language | null;
    const isSystemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;
    const initialTheme = savedTheme || "system";
    const initialLang = savedLang || "fa";
    const initialDir = initialLang === "fa" ? "rtl" : "ltr";

    document.documentElement.dir = initialDir;
    document.documentElement.lang = initialLang;
    if (
        initialTheme === "dark" ||
        (initialTheme === "system" && isSystemDark)
    ) {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }

    return {
        language: initialLang,
        direction: initialDir,
        translations: {},
        theme: initialTheme,
        setTheme: (theme: Theme) => {
            const isDark =
                theme === "dark" ||
                (theme === "system" &&
                    window.matchMedia("(prefers-color-scheme: dark)").matches);
            document.documentElement.classList.toggle("dark", isDark);
            localStorage.setItem("theme", theme);
            set({ theme });
        },
        setLanguage: (lang: Language) => {
            const newDir = lang === "fa" ? "rtl" : "ltr";
            document.documentElement.lang = lang;
            document.documentElement.dir = newDir;
            localStorage.setItem("language", lang);
            set({ language: lang, direction: newDir });
        },
    };
});
