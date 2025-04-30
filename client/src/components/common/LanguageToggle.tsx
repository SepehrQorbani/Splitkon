import { useUIStore } from "@/store";
import ToggleButtonGroup from "@/components/common/ToggleButtonGroup";

type Language = "en" | "fa";
const LANGUAGE_TOGGLE_LABELS: Record<Language, string> = {
    en: "فارسی",
    fa: "English",
};
export function LanguageToggle() {
    const { language, setLocale } = useUIStore();
    const toggleLanguage = (v: Language) =>
        setLocale(v === "en" ? "en-US" : "fa-IR-u-ca-persian");

    return (
        <ToggleButtonGroup
            buttons={[
                {
                    id: "en",
                    icon: <span className="size-4">En</span>,
                },
                {
                    id: "fa",
                    icon: <span className="size-4">فا</span>,
                },
            ]}
            value={language}
            onChange={(v) => toggleLanguage(v as Language)}
            aria-label={LANGUAGE_TOGGLE_LABELS[language as Language]}
        />
    );
}
