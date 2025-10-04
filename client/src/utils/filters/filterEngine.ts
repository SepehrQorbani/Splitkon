import Fuse from "fuse.js";
import {
    EntityFilterConfig,
    FilterState,
    EngineResult,
    FuseOptionsLite,
} from "./filterTypes";

export function filterEngine<T>(
    rows: T[],
    config: EntityFilterConfig<T>,
    filters: FilterState,
    t?: (key: string) => string,
    fuseOptions?: FuseOptionsLite
): EngineResult<T> {
    let working = rows;

    // پیدا کردن کلیدهای searchable فقط یک‌بار
    const searchableKeys = Object.entries(config)
        .filter(([, def]) => def.searchable)
        .map(([k]) => k);

    // helper: اجرای fuzzy search
    const applyFuzzy = (source: T[], q?: string): T[] => {
        if (!q || !searchableKeys.length) return source;
        const projection = source.map((r, idx) => {
            const projected: Record<string, any> = { _idx: idx };
            searchableKeys.forEach((k) => {
                const def = config[k];
                let value = String(def.get(r) ?? "");
                if (def.translate && t) {
                    value = t(
                        def.translationKeyPrefix
                            ? `${def.translationKeyPrefix}${value}`
                            : value
                    );
                }
                projected[k] = value;
            });
            return projected;
        });

        const fuse = new Fuse(projection, {
            keys: searchableKeys,
            threshold: fuseOptions?.threshold ?? 0.35,
            ignoreLocation: fuseOptions?.ignoreLocation ?? true,
        });

        const indices = new Set(fuse.search(q).map((m) => m.item._idx));
        return source.filter((_, i) => indices.has(i));
    };

    // ۱) فازی
    working = applyFuzzy(working, filters.q);

    // ۲) فیلترهای enum
    if (filters.enums) {
        for (const [field, values] of Object.entries(filters.enums)) {
            if (!values?.length) continue;
            const def = config[field];
            if (!def) continue;
            working = working.filter((r) => {
                let val = String(def.get(r));
                if (def.translate && t) {
                    val = t(
                        def.translationKeyPrefix
                            ? `${def.translationKeyPrefix}${val}`
                            : val
                    );
                }
                return values.includes(val);
            });
        }
    }

    // ۳) بازه‌های عددی
    if (filters.ranges) {
        for (const [field, range] of Object.entries(filters.ranges)) {
            const def = config[field];
            if (!def || !def.rangeable) continue;
            working = working.filter((r) => {
                const v = Number(def.get(r) ?? 0);
                if (range.min != null && v < range.min) return false;
                if (range.max != null && v > range.max) return false;
                return true;
            });
        }
    }

    // ۴) بولی‌ها
    if (filters.booleans) {
        for (const [field, val] of Object.entries(filters.booleans)) {
            const def = config[field];
            if (!def) continue;
            working = working.filter(
                (r) => Boolean(def.get(r)) === Boolean(val)
            );
        }
    }

    // ۵) تاریخ‌ها
    if (filters.dates) {
        for (const [field, range] of Object.entries(filters.dates)) {
            const def = config[field];
            if (!def) continue;
            working = working.filter((r) => {
                const v = new Date(String(def.get(r))).getTime();
                if (range.from && v < new Date(range.from).getTime())
                    return false;
                if (range.to && v > new Date(range.to).getTime()) return false;
                return true;
            });
        }
    }

    // ۶) مرتب‌سازی
    if (filters.sortBy && config[filters.sortBy]?.sortable) {
        const dir = filters.sortDir === "desc" ? -1 : 1;
        const get = config[filters.sortBy].get;
        working = [...working].sort((a, b) => {
            let va: any = get(a);
            let vb: any = get(b);
            if (config[filters.sortBy!].translate && t) {
                va = t(
                    config[filters.sortBy!].translationKeyPrefix
                        ? `${config[filters.sortBy!].translationKeyPrefix}${va}`
                        : String(va)
                );
                vb = t(
                    config[filters.sortBy!].translationKeyPrefix
                        ? `${config[filters.sortBy!].translationKeyPrefix}${vb}`
                        : String(vb)
                );
            }
            if (typeof va === "string" && typeof vb === "string") {
                return va.localeCompare(vb) * dir;
            }
            return ((Number(va) || 0) - (Number(vb) || 0)) * dir;
        });
    }

    // ۷) ساخت facetها
    const facets: EngineResult<T>["facets"] = {};

    const applyAllExceptEnumOf = (source: T[], excludeField: string): T[] => {
        let base = source;
        base = applyFuzzy(base, filters.q);

        if (filters.enums) {
            for (const [field, values] of Object.entries(filters.enums)) {
                if (field === excludeField) continue;
                if (!values?.length) continue;
                const def = config[field];
                if (!def) continue;
                base = base.filter((r) => {
                    let val = String(def.get(r));
                    if (def.translate && t) {
                        val = t(
                            def.translationKeyPrefix
                                ? `${def.translationKeyPrefix}${val}`
                                : val
                        );
                    }
                    return values.includes(val);
                });
            }
        }

        if (filters.ranges) {
            for (const [field, range] of Object.entries(filters.ranges)) {
                const def = config[field];
                if (!def || !def.rangeable) continue;
                base = base.filter((r) => {
                    const v = Number(def.get(r) ?? 0);
                    if (range.min != null && v < range.min) return false;
                    if (range.max != null && v > range.max) return false;
                    return true;
                });
            }
        }

        if (filters.booleans) {
            for (const [field, val] of Object.entries(filters.booleans)) {
                const def = config[field];
                if (!def) continue;
                base = base.filter((r) => Boolean(def.get(r)) === Boolean(val));
            }
        }

        if (filters.dates) {
            for (const [field, range] of Object.entries(filters.dates)) {
                const def = config[field];
                if (!def) continue;
                base = base.filter((r) => {
                    const v = new Date(String(def.get(r))).getTime();
                    if (range.from && v < new Date(range.from).getTime())
                        return false;
                    if (range.to && v > new Date(range.to).getTime())
                        return false;
                    return true;
                });
            }
        }

        return base;
    };

    for (const [field, def] of Object.entries(config)) {
        if (!def.facetable) continue;

        const universe = new Set<string>();
        for (const r of rows) {
            let v = String(def.get(r));
            if (def.translate && t) {
                v = t(
                    def.translationKeyPrefix
                        ? `${def.translationKeyPrefix}${v}`
                        : v
                );
            }
            universe.add(v);
        }

        const base = applyAllExceptEnumOf(rows, field);

        const counts: Record<string, number> = {};
        for (const r of base) {
            let v = String(def.get(r));
            if (def.translate && t) {
                v = t(
                    def.translationKeyPrefix
                        ? `${def.translationKeyPrefix}${v}`
                        : v
                );
            }
            counts[v] = (counts[v] ?? 0) + 1;
        }

        for (const v of universe) {
            if (counts[v] == null) counts[v] = 0;
        }

        facets[field] = counts;
    }

    return { rows: working, facets };
}
