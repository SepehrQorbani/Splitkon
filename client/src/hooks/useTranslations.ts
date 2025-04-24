import { useGroupStore, useUIStore } from "@/store";
import { formatDate } from "@/utils/date";

interface TranslationOptions {
    [key: string]: string;
}
export const useTranslations = () => {
    const locale = useUIStore((state) => state.locale);
    const language = useUIStore((state) => state.language);
    const direction = useUIStore((state) => state.direction);
    const setLocale = useUIStore((state) => state.setLocale);
    const translations = useUIStore((state) => state.translations);
    const currency = useGroupStore((state) => state.currency);

    const t = (key: string, options: TranslationOptions = {}): string => {
        const parts = key.split(".");
        let message: string = key;

        let current: any = translations;
        for (const part of parts) {
            if (!current || typeof current !== "object") break;
            current = current[part];
        }

        if (typeof current === "string") {
            message = current;
        } else if (parts.length === 1) {
            const uiTranslation = translations.ui?.[key];
            if (typeof uiTranslation === "string") {
                message = uiTranslation;
            } else {
                for (const category in translations) {
                    const value = translations[category]?.[key];
                    if (category !== "ui" && typeof value === "string") {
                        message = value;
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

    const formatNumber = (
        number: number,
        options?: Intl.NumberFormatOptions
    ) => {
        return new Intl.NumberFormat(locale.toString(), options).format(number);
    };

    function formatCurrency(
        amount: number,
        options?: Intl.NumberFormatOptions
    ): [string, string] {
        if (!currency?.display_unit) {
            return [amount.toLocaleString(locale), ""];
        }
        return [amount.toLocaleString(locale), t(currency?.display_unit)];
    }

    return {
        locale,
        language,
        direction,
        setLocale,
        t,
        formatDate: (
            date: Date | string,
            options?: Intl.DateTimeFormatOptions
        ) => formatDate(locale.toString(), date, options),
        formatNumber,
        formatCurrency,
    };
};
