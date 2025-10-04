import {
    SearchFilter,
    SortFilter,
    RangeFilter,
    EnumFilter,
} from "@/components/common/filters";
import { useTranslations } from "@/hooks/useTranslations";
import { IconSortAscending, IconSortDescending } from "@tabler/icons-react";
import { useMemo } from "react";
import { FilterState, EngineResult } from "@/utils/filters/filterTypes";
import { Repay } from "@/types/schemas/repays";
import { repayFilterConfig } from "@/utils/filters/repayFilterConfig";

type RepaysFilterProps = {
    filters: FilterState;
    localQ: string;
    setQInput: (value: string) => void;
    localRanges: Record<string, { min?: number; max?: number }>;
    setRangeInput: (field: string, min?: number, max?: number) => void;
    setEnum: (field: string, values: string[] | null) => void;
    setSort: (field?: string, dir?: "asc" | "desc") => void;
    result: EngineResult<Repay>;
};

function RepaysFilter({
    filters,
    localQ,
    setQInput,
    localRanges,
    setRangeInput,
    setEnum,
    setSort,
    result,
}: RepaysFilterProps) {
    const { t } = useTranslations();

    // Prepare enum filter options
    const enumFilterOptions = useMemo(() => {
        return Object.entries(repayFilterConfig)
            .filter(([, def]) => def.facetable && !def.rangeable)
            .map(([field]) => ({
                field,
                label: t(`attributes.${field}`),
            }));
    }, [t]);

    // Prepare range filter options
    const rangeFilterOptions = useMemo(() => {
        return Object.entries(repayFilterConfig)
            .filter(([, def]) => def.rangeable)
            .map(([field]) => ({
                field,
                label: t(`attributes.${field}`),
            }));
    }, [t]);

    return (
        <div className="flex flex-wrap gap-2 mb-4 justify-between">
            {/* Search Filter */}
            <SearchFilter
                value={localQ}
                onChange={setQInput}
                className="flex-1 md:flex-none md:w-1/2 md:pe-2 lg:w-1/3 lg:pe-2"
            />

            {/* Sort Filter */}
            <SortFilter
                config={repayFilterConfig}
                value={filters.sortBy}
                sortDir={filters.sortDir}
                onChange={setSort}
                className="shrink-0"
            />

            {/* Enum Filters */}
            {/* {enumFilterOptions.map(({ field, label }) => {
                const facetValues = result.facets[field] || {};

                const options = Object.entries(facetValues).map(
                    ([key, count]) => ({
                        id: key,
                        label: repayFilterConfig[field]["translate"]
                            ? t(key)
                            : key,
                        count: count as number,
                    })
                );

                const selectedValue = filters.enums?.[field];

                return (
                    <EnumFilter
                        key={field}
                        field={field}
                        label={label}
                        value={selectedValue || undefined}
                        options={options}
                        onChange={(v) => {
                            if (v) {
                                setEnum(field, Array.isArray(v) ? v : [v]);
                            } else {
                                setEnum(field, null);
                            }
                        }}
                        showToggle={true}
                        className=""
                    />
                );
            })} */}

            {/* Range Filters */}
            {/* {rangeFilterOptions.map(({ field, label }) => {
                const range = localRanges[field] || {};
                return (
                    <RangeFilter
                        key={field}
                        field={field}
                        label={label}
                        value={range}
                        onChange={(min, max) => setRangeInput(field, min, max)}
                        className=""
                    />
                );
            })} */}
        </div>
    );
}

export default RepaysFilter;
