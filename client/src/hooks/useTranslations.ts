import { useUIStore } from "@/store";

interface TranslationOptions {
    [key: string]: string | number;
}

export const useTranslations = () => {
    const language = useUIStore((state) => state.language);
    const direction = useUIStore((state) => state.direction);
    const setLanguage = useUIStore((state) => state.setLanguage);
    const translations = useUIStore((state) => state.translations);

    // const t = (key: string, options: TranslationOptions = {}) => {
    //     // Try validation first, then ui, then fallback to key
    //     let message =
    //         translations.validation[key] || translations.ui[key] || key;

    //     if (Object.keys(options).length > 0) {
    //         message = Object.entries(options).reduce(
    //             (msg, [param, value]) =>
    //                 msg.replace(`:${param}`, String(value)),
    //             message
    //         );
    //     }
    //     return message;
    // };
    // const t = (key: string, options: TranslationOptions = {}) => {
    //     const parts = key.split(".");
    //     let message: string | undefined;

    //     if (parts.length > 1) {
    //         // Nested key access (e.g., "messages.welcome", "attributes.name")
    //         let current: any = translations;
    //         for (const part of parts) {
    //             current = current?.[part];
    //             if (!current) break;
    //         }
    //         message = current || key;
    //     } else {
    //         // Flat key lookup: search all top-level categories
    //         for (const category in translations) {
    //             if (translations[category]?.[key]) {
    //                 message = translations[category][key];
    //                 break;
    //             }
    //         }
    //         message = message || key; // Fallback to key if not found
    //     }

    //     if (options.attribute) {
    //         const attrKey = options.attribute as string;
    //         const attrValue = translations.attributes?.[attrKey] || attrKey;
    //         options.attribute = attrValue;
    //     }

    //     // Apply all options substitutions
    //     if (Object.keys(options).length > 0) {
    //         message = Object.entries(options).reduce(
    //             (msg, [param, value]) =>
    //                 msg.replace(`:${param}`, String(value)),
    //             message
    //         );
    //     }

    //     return message;
    // };
    const t = (key: string, options: TranslationOptions = {}): string => {
        const parts = key.split(".");
        let message: string = key; // Default to key as a string fallback

        if (parts.length > 1) {
            // Nested key access (e.g., "messages.welcome", "attributes.name")
            let current: any = translations;
            for (const part of parts) {
                current = current?.[part];
                if (!current) break;
            }
            message = typeof current === "string" ? current : key;
        } else {
            // Flat key lookup: search all top-level categories
            for (const category in translations) {
                if (translations[category]?.[key]) {
                    message = translations[category][key];
                    break;
                }
            }
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
