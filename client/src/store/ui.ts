import en from "@/lang/en.json";
import fa from "@/lang/fa.json";
import { create } from "zustand";

type Language = "fa" | "en";
type Direction = "rtl" | "ltr";
type Theme = "dark" | "light" | "system";
type Locale = Intl.Locale;

export type NestedTranslations =
    | string
    | Array<NestedTranslations>
    | { [key: string]: NestedTranslations };
interface Translations {
    [key: string]: Record<string, NestedTranslations> | undefined;
}

const translationsMap: Record<Language, Translations> = { en, fa };

interface UIState {
    locale: Locale;
    language: Language;
    direction: Direction;
    translations: Translations;
    theme: Theme;
    view: "grid" | "table";
    setTheme: (theme: Theme) => void;
    setLocale: (locale: string) => void;
    setView: (view: "grid" | "table") => void;
}

export const useUIStore = create<UIState>((set) => {
    const savedLocale = localStorage.getItem("locale") || "fa-IR";
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const savedView = (localStorage.getItem("view") ?? "grid") as
        | "grid"
        | "table";

    const isSystemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;
    const initialTheme = savedTheme || "light";
    const initialLocale = new Intl.Locale(savedLocale);
    const initialLang = initialLocale.language as Language;
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
        locale: initialLocale,
        language: initialLang,
        direction: initialDir,
        translations: translationsMap[initialLang],
        theme: initialTheme,
        view: savedView,
        setTheme: (theme: Theme) => {
            const isDark =
                theme === "dark" ||
                (theme === "system" &&
                    window.matchMedia("(prefers-color-scheme: dark)").matches);
            document.documentElement.classList.toggle("dark", isDark);
            localStorage.setItem("theme", theme);
            set({ theme });
        },
        setLocale: (locale: string) => {
            const newLocale = new Intl.Locale(locale);
            const newDir = newLocale.language === "fa" ? "rtl" : "ltr";
            document.documentElement.lang = newLocale.language;
            document.documentElement.dir = newDir;
            localStorage.setItem("locale", locale);

            set({
                locale: newLocale,
                language: newLocale.language as Language,
                direction: newDir,
                translations: translationsMap[newLocale.language as Language],
            });
        },
        setView: (view: "grid" | "table") => {
            localStorage.setItem("view", view);
            set({ view: view });
        },
    };
});
