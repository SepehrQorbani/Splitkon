import { FilterState, EntityFilterConfig } from "./filterTypes";

export function getAll(sp: URLSearchParams, key: string): string[] {
    return sp.getAll(key);
}

export function getOne(sp: URLSearchParams, key: string): string | undefined {
    return sp.get(key) ?? undefined;
}

export function parseFiltersFromParams<T>(
    sp: URLSearchParams,
    config: EntityFilterConfig<T>
): FilterState {
    const q = getOne(sp, "q");
    const sortBy = getOne(sp, "sortBy");
    const sortDir =
        (getOne(sp, "sortDir") as FilterState["sortDir"]) || undefined;

    const enums: FilterState["enums"] = {};
    const ranges: FilterState["ranges"] = {};
    const booleans: FilterState["booleans"] = {};
    const dates: FilterState["dates"] = {};

    const allKeys = Array.from(sp.keys());

    for (const key of allKeys) {
        if (["q", "sortBy", "sortDir"].includes(key)) continue;

        if (key.endsWith("Min")) {
            const baseKey = key.slice(0, -3);
            if (!config[baseKey]?.rangeable) continue;
            const value = getOne(sp, key);
            if (value != null) {
                const num = Number(value);
                if (isNaN(num)) continue;
                if (!ranges[baseKey]) ranges[baseKey] = {};
                ranges[baseKey].min = num;
            }
            continue;
        }

        if (key.endsWith("Max")) {
            const baseKey = key.slice(0, -3);
            if (!config[baseKey]?.rangeable) continue;
            const value = getOne(sp, key);
            if (value != null) {
                const num = Number(value);
                if (isNaN(num)) continue;
                if (!ranges[baseKey]) ranges[baseKey] = {};
                ranges[baseKey].max = num;
            }
            continue;
        }

        if (key.endsWith("From")) {
            const baseKey = key.slice(0, -4);
            if (config[baseKey]?.type !== "date") continue;
            const value = getOne(sp, key);
            if (value != null && !isNaN(Date.parse(value))) {
                // sanitize ISO string
                if (!dates[baseKey]) dates[baseKey] = {};
                dates[baseKey].from = value;
            }
            continue;
        }

        if (key.endsWith("To")) {
            const baseKey = key.slice(0, -2);
            if (config[baseKey]?.type !== "date") continue;
            const value = getOne(sp, key);
            if (value != null && !isNaN(Date.parse(value))) {
                // sanitize ISO string
                if (!dates[baseKey]) dates[baseKey] = {};
                dates[baseKey].to = value;
            }
            continue;
        }

        const value = getOne(sp, key);
        if (
            config[key]?.type === "boolean" &&
            (value === "true" || value === "false")
        ) {
            booleans[key] = value === "true";
            continue;
        }

        if (config[key]?.facetable) {
            const enumValues = getAll(sp, key);
            if (enumValues.length > 0) {
                enums[key] = enumValues;
            }
        }
    }

    return {
        q,
        sortBy,
        sortDir,
        enums: Object.keys(enums).length ? enums : undefined,
        ranges: Object.keys(ranges).length ? ranges : undefined,
        booleans: Object.keys(booleans).length ? booleans : undefined,
        dates: Object.keys(dates).length ? dates : undefined,
    };
}

export function setParam(
    sp: URLSearchParams,
    key: string,
    value?: string | string[] | boolean
) {
    const next = new URLSearchParams(sp);
    if (value == null || (Array.isArray(value) && value.length === 0)) {
        next.delete(key);
    } else if (Array.isArray(value)) {
        next.delete(key);
        value.forEach((v) => next.append(key, v));
    } else if (typeof value === "boolean") {
        next.set(key, value ? "true" : "false");
    } else {
        if (value === "") next.delete(key);
        else next.set(key, value);
    }
    return next;
}
