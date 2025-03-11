import { create } from "zustand";

interface UIState {
    isDarkMode: boolean;
    isLoading: boolean;
    toggleDarkMode: () => void;
    resetToSystem: () => void;
    startLoading: () => void; // Explicit start
    stopLoading: () => void; // Explicit stop
}

export const useUIStore = create<UIState>((set) => {
    const savedMode = localStorage.getItem("darkMode");
    const isSystemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;
    const initialMode =
        savedMode !== null ? savedMode === "true" : isSystemDark;

    if (initialMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");

    return {
        isDarkMode: initialMode,
        isLoading: false,
        toggleDarkMode: () =>
            set((state) => {
                const newMode = !state.isDarkMode;
                document.documentElement.classList.toggle("dark", newMode);
                localStorage.setItem("darkMode", newMode.toString());
                return { isDarkMode: newMode };
            }),
        resetToSystem: () => {
            localStorage.removeItem("darkMode");
            const newMode = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;
            document.documentElement.classList.toggle("dark", newMode);
            set({ isDarkMode: newMode });
        },
        startLoading: () => set({ isLoading: true }),
        stopLoading: () => set({ isLoading: false }),
    };
});
