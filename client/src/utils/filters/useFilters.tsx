import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import { filterEngine } from "./filterEngine";
import { EntityFilterConfig, FilterState, EngineResult } from "./filterTypes";
import { parseFiltersFromParams, setParam } from "./url";
import { useTranslations } from "@/hooks/useTranslations";
import { useDebounce } from "@uidotdev/usehooks";

export function useFilters<T>(
    rows: T[] | undefined,
    config: EntityFilterConfig<T>
) {
    const [sp, setSp] = useSearchParams();
    const { t } = useTranslations();

    const filters: FilterState = useMemo(
        () => parseFiltersFromParams(sp, config),
        [sp, config]
    );

    const [localQ, setLocalQ] = useState(filters.q || "");
    const [localRanges, setLocalRanges] = useState(filters.ranges || {});
    const [localBooleans, setLocalBooleans] = useState(filters.booleans || {});
    const [localDates, setLocalDates] = useState(filters.dates || {});

    const debouncedQ = useDebounce(localQ, 300);
    const debouncedRanges = useDebounce(localRanges, 300);
    const debouncedBooleans = useDebounce(localBooleans, 300);
    const debouncedDates = useDebounce(localDates, 300);

    useEffect(() => {
        const next = setParam(sp, "q", debouncedQ);
        if (next.toString() !== sp.toString()) {
            setSp(next);
        }
    }, [debouncedQ, sp, setSp]);

    useEffect(() => {
        let next = sp;
        for (const [key, r] of Object.entries(debouncedRanges)) {
            next = setParam(
                next,
                `${key}Min`,
                r?.min != null ? String(r.min) : undefined
            );
            next = setParam(
                next,
                `${key}Max`,
                r?.max != null ? String(r.max) : undefined
            );
        }
        if (next.toString() !== sp.toString()) {
            setSp(next);
        }
    }, [debouncedRanges]);

    useEffect(() => {
        let next = sp;
        for (const [key, value] of Object.entries(debouncedBooleans)) {
            next = setParam(next, key, value);
        }
        if (next.toString() !== sp.toString()) {
            setSp(next);
        }
    }, [debouncedBooleans]);

    useEffect(() => {
        let next = sp;
        for (const [key, d] of Object.entries(debouncedDates)) {
            next = setParam(next, `${key}From`, d?.from);
            next = setParam(next, `${key}To`, d?.to);
        }
        if (next.toString() !== sp.toString()) {
            setSp(next);
        }
    }, [debouncedDates]);

    const result: EngineResult<T> = useMemo(() => {
        if (!rows) return { rows: [], facets: {} } as EngineResult<T>;
        return filterEngine(rows, config, filters, t);
    }, [rows, config, filters, t]);

    const setQInput = (q?: string) => setLocalQ(q ?? "");
    const setRangeInput = (key: string, min?: number, max?: number) => {
        setLocalRanges((prev) => ({
            ...prev,
            [key]: { min, max },
        }));
    };
    const setBooleanInput = (key: string, value: boolean) => {
        setLocalBooleans((prev) => ({
            ...prev,
            [key]: value,
        }));
    };
    const setDateInput = (key: string, from?: string, to?: string) => {
        setLocalDates((prev) => ({
            ...prev,
            [key]: { from, to },
        }));
    };

    const setSort = (sortBy?: string, sortDir?: "asc" | "desc") => {
        let next = setParam(sp, "sortBy", sortBy);
        next = setParam(next, "sortDir", sortDir);
        if (next.toString() !== sp.toString()) {
            setSp(next);
        }
    };

    const setEnum = (key: string, values: string[] | null) => {
        const next = setParam(sp, key, values ?? undefined);
        if (next.toString() !== sp.toString()) {
            setSp(next);
        }
    };

    return {
        filters,
        result,
        localQ,
        localRanges,
        localBooleans,
        localDates,
        setQInput,
        setRangeInput,
        setBooleanInput,
        setDateInput,
        setSort,
        setEnum,
    };
}
