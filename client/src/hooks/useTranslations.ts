import { useUIStore } from "@/store";

interface TranslationOptions {
    [key: string]: string | number;
}
// const useTranslations = () => {
//     const { t: rawT } = useUIStore((state) => state);
//     return {
//         t: (key: string, params?: Record<string, string>) => {
//             const value = rawT(key);
//             return value !== undefined ? (params ? interpolate(value, params) : value) : key;
//         },
//     };
// };
// const interpolate = (str: string, params: Record<string, string>) =>
//     str.replace(/:(\w+)/g, (_, key) => params[key] || key);
export const useTranslations = () => {
    const language = useUIStore((state) => state.language);
    const direction = useUIStore((state) => state.direction);
    const setLanguage = useUIStore((state) => state.setLanguage);
    const translations = useUIStore((state) => state.translations);

    const t = (key: string, options: TranslationOptions = {}): string => {
        const parts = key.split(".");
        let message: string = key; // Fallback to key

        if (parts.length > 1) {
            // Nested key access
            let current: any = translations;
            for (const part of parts) {
                current = current?.[part];
                if (!current) break;
            }
            message = typeof current === "string" ? current : key;
        } else {
            // Flat key lookup: prioritize 'ui' first, then search all categories
            if (translations.ui?.[key]) {
                message = translations.ui[key];
            } else {
                for (const category in translations) {
                    if (translations[category]?.[key]) {
                        message = translations[category][key];
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

        // Substitute :attribute with translated value if provided
        if (options.attribute) {
            const attrKey = options.attribute as string;
            const attrValue = translations.attributes?.[attrKey] || attrKey;
            options.attribute = attrValue;
        }

        // Apply all options substitutions
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
