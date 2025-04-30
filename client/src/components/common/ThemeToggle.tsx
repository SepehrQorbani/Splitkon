import { useUIStore } from "@/store";
import ToggleButtonGroup from "@/components/common/ToggleButtonGroup";
import { IconMoon, IconSun } from "@tabler/icons-react";

const THEME_TOGGLE_LABELS: Record<Theme, string> = {
    dark: "Switch to light mode",
    light: "Switch to dark mode",
};

type Theme = "light" | "dark";

export function ThemeToggle() {
    const { theme, setTheme } = useUIStore();

    return (
        <ToggleButtonGroup
            buttons={[
                {
                    id: "light",
                    icon: <IconSun className="size-4" />,
                },
                {
                    id: "dark",
                    icon: <IconMoon className="size-4" />,
                },
            ]}
            value={theme}
            onChange={(v) => setTheme(v as Theme)}
            aria-label={THEME_TOGGLE_LABELS[theme as Theme]}
        />
    );
}
