import {
    SearchFilter,
    SortFilter,
    RangeFilter,
    EnumFilter,
} from "@/components/common/filters";
import { useTranslations } from "@/hooks/useTranslations";
import { memberFilterConfig } from "@/utils/filters/memberConfig";
import { IconSortAscending, IconSortDescending } from "@tabler/icons-react";
import { useMemo } from "react";
import { FilterState, EngineResult } from "@/utils/filters/filterTypes";
import { Member } from "@/types/schemas/members";

type FilterVisibility = {
    search?: boolean;
    sort?: boolean;
    enums?: boolean;
    ranges?: boolean;
};

type MembersFilterProps = {
    filters: FilterState;
    localQ: string;
    setQInput: (value: string) => void;
    localRanges: Record<string, { min?: number; max?: number }>;
    setRangeInput: (field: string, min?: number, max?: number) => void;
    setEnum: (field: string, values: string[] | null) => void;
    setSort: (field?: string, dir?: "asc" | "desc") => void;
    result: EngineResult<Member>;
    visibility?: FilterVisibility;
};

function MembersFilter({
    filters,
    localQ,
    setQInput,
    localRanges,
    setRangeInput,
    setEnum,
    setSort,
    result,
    visibility = { search: true, sort: true, enums: false, ranges: false },
}: MembersFilterProps) {
    const { t } = useTranslations();

    const enumFilterOptions = useMemo(() => {
        return Object.entries(memberFilterConfig)
            .filter(([, def]) => def.facetable && !def.rangeable)
            .map(([field]) => ({
                field,
                label: t(`attributes.${field}`),
            }));
    }, [t]);

    const rangeFilterOptions = useMemo(() => {
        return Object.entries(memberFilterConfig)
            .filter(([, def]) => def.rangeable)
            .map(([field]) => ({
                field,
                label: t(`attributes.${field}`),
            }));
    }, [t]);

    return (
        <div className="flex flex-wrap gap-2 justify-between">
            {/* Search Filter */}
            {visibility.search && (
                <SearchFilter
                    value={localQ}
                    onChange={setQInput}
                    className="flex-1 md:flex-none md:w-1/2 md:pe-2 lg:w-1/3 lg:pe-2"
                />
            )}

            {/* Sort Filter */}
            {visibility.sort && (
                <SortFilter
                    config={memberFilterConfig}
                    value={filters.sortBy}
                    sortDir={filters.sortDir}
                    onChange={setSort}
                    className="shrink-0"
                />
            )}

            {/* Enum Filters */}
            {visibility.enums &&
                enumFilterOptions.map(({ field, label }) => {
                    const facetValues = result.facets[field] || {};
                    const options = Object.entries(facetValues).map(
                        ([key, count]) => ({
                            id: key,
                            label: t(key),
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
                })}

            {/* Range Filters */}
            {visibility.ranges &&
                rangeFilterOptions.map(({ field, label }) => {
                    const range = localRanges[field] || {};
                    return (
                        <RangeFilter
                            key={field}
                            field={field}
                            label={label}
                            value={range}
                            onChange={(min, max) =>
                                setRangeInput(field, min, max)
                            }
                            className=""
                        />
                    );
                })}
        </div>
    );
}

export default MembersFilter;
