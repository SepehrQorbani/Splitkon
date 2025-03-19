import { useUIStore } from "@/store";
import en from "@/lang/en.json";
import fa from "@/lang/fa.json";

type Language = "fa" | "en";
interface Translations {
    ui: Record<string, string>;
    [key: string]: Record<string, string> | undefined;
}

const translationsMap: Record<Language, Translations> = { en, fa };

interface TranslationOptions {
    [key: string]: string | number;
}
// Hold the current translations in a reactive reference
let currentTranslations = translationsMap[useUIStore.getState().language];

// Subscribe to store updates to keep translations in sync
useUIStore.subscribe((state) => {
    currentTranslations = translationsMap[state.language];
});

export const t = (key: string, options: TranslationOptions = {}): string => {
    const translations = currentTranslations;
    // const { language } = useUIStore.getState();
    // const translations = translationsMap[language];

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
        for (const category in translations) {
            if (translations[category]?.[key]) {
                message = translations[category][key];
                break;
            }
        }
    }

    if (options.attribute) {
        const attrKey = options.attribute as string;
        const attrValue = translations.attributes?.[attrKey] || attrKey;
        options.attribute = attrValue;
    }

    if (Object.keys(options).length > 0) {
        message = Object.entries(options).reduce(
            (msg, [param, value]) => msg.replace(`:${param}`, String(value)),
            message
        );
    }

    return message;
};
