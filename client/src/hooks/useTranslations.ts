import { NestedTranslations, useGroupStore, useUIStore } from "@/store";
import { formatDate } from "@/utils/date";

interface TranslationOptions {
    [key: string]: string | number;
}

const DEFAULT_NAMESPACE = "ui";

function replacePlaceholders(
    text: string,
    replacements: Record<string, string | number>
): string {
    return Object.entries(replacements).reduce((result, [key, value]) => {
        const regex = new RegExp(`:${key}`, "g");
        return result.replace(regex, String(value));
    }, text);
}

function getNestedValue(
    obj: any,
    path: string
): NestedTranslations | undefined {
    return path.split(".").reduce((acc, key) => {
        if (acc && typeof acc === "object") {
            return acc[key];
        }
        return undefined;
    }, obj);
}

function deepSearch(
    obj: any,
    key: string,
    path = ""
): { path: string; value: string } | null {
    if (typeof obj !== "object" || obj === null) return null;

    for (const k in obj) {
        const currentPath = path ? `${path}.${k}` : k;

        if (k === key && typeof obj[k] === "string") {
            return { path: currentPath, value: obj[k] };
        }

        const result = deepSearch(obj[k], key, currentPath);
        if (result) return result;
    }

    return null;
}

export const useTranslations = () => {
    const locale = useUIStore((state) => state.locale);
    const language = useUIStore((state) => state.language);
    const direction = useUIStore((state) => state.direction);
    const setLocale = useUIStore((state) => state.setLocale);
    const translations = useUIStore((state) => state.translations);
    const currency = useGroupStore((state) => state.currency);

    const t = <T = string>(
        key: string,
        options: TranslationOptions = {}
    ): T extends NestedTranslations ? T : string => {
        if (!key) return key as T extends NestedTranslations ? T : string;

        const [firstKey, ...rest] = key.split(".");
        const actualKey =
            rest.length === 0
                ? [DEFAULT_NAMESPACE, firstKey]
                : [firstKey, ...rest];

        const fullPath = actualKey.join(".");
        let value = getNestedValue(translations, fullPath);

        if (value === undefined) {
            const lastKey = rest.length === 0 ? firstKey : rest.at(-1) || "";
            const found = deepSearch(translations, lastKey);

            if (found) {
                process.env.NODE_ENV === "development" &&
                    console.warn(
                        `Translation key "${fullPath}" not found. Found fallback at "${found.path}".`
                    );
                value = found.value;
            } else {
                process.env.NODE_ENV === "development" &&
                    console.warn(
                        `Translation key "${fullPath}" not found and no fallback available.`
                    );
                return fullPath as T extends NestedTranslations ? T : string;
            }
        }

        if (typeof value === "string") {
            return replacePlaceholders(
                value,
                options
            ) as T extends NestedTranslations ? T : string;
        }

        return value as T extends NestedTranslations ? T : string;
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

    //TODO: refactor
    function formatDaysToWords(diff: number, suffix: boolean = true): string {
        if (diff === 0) return t("ui.time.zeroDays");

        const days = Math.abs(diff);
        const years = Math.floor(days / 365);
        const remainingDaysAfterYears = days % 365;
        const months = Math.floor(remainingDaysAfterYears / 30);
        const remainingDays = remainingDaysAfterYears % 30;

        const parts: string[] = [];

        if (years > 0) {
            parts.push(t("ui.time.year", { count: years.toString() }));
        }

        if (months > 0) {
            parts.push(t("ui.time.month", { count: months.toString() }));
        }

        if (remainingDays > 0) {
            parts.push(t("ui.time.day", { count: remainingDays.toString() }));
        }

        const timeString = parts.join(t("ui.time.and"));
        return suffix
            ? `${timeString} ${
                  diff > 0 ? t("ui.time.ago") : t("ui.time.fromNow")
              }`
            : timeString;
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
        formatDaysToWords,
    };
};
