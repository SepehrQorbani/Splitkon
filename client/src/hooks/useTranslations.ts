import { useUIStore } from "@/store";

interface TranslationOptions {
    [key: string]: string;
}
export const useTranslations = () => {
    const language = useUIStore((state) => state.language);
    const direction = useUIStore((state) => state.direction);
    const setLanguage = useUIStore((state) => state.setLanguage);
    const translations = useUIStore((state) => state.translations);

    const t = (key: string, options: TranslationOptions = {}): string => {
        const parts = key.split(".");
        let message: string = key; // Fallback to key

        if (parts.length > 1) {
            let current: any = translations;
            for (const part of parts) {
                current = current?.[part];
                if (!current) break;
            }
            message = typeof current === "string" ? current : key;
        } else {
            if (translations.ui?.[key]) {
                message = translations.ui[key] as string;
            } else {
                for (const category in translations) {
                    if (translations[category]?.[key]) {
                        message = translations[category][key] as string;
                        break;
                    }
                }
            }
        }

        // Warn in development if key is missing
        if (process.env.NODE_ENV === "development" && message === key) {
            console.warn(
                `Translation missing for key: "${key}" in language: "${language}"`
            );
        }

        if (options.attribute) {
            const attrKey = options.attribute as string;
            const attrValue = translations.attributes?.[attrKey] || attrKey;
            options.attribute = attrValue as string;
        }

        if (Object.keys(options).length > 0) {
            message = Object.entries(options).reduce(
                (msg, [param, value]) =>
                    msg.replace(`:${param}`, String(value)),
                message
            );
        }

        return message;
    };

    return { language, direction, setLanguage, t };
};
