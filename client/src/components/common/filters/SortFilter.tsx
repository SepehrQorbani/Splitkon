import Select from "@/components/common/Select";
import { useTranslations } from "@/hooks/useTranslations";
import { EntityFilterConfig } from "@/utils/filters/filterTypes";
import {
    IconArrowsSort,
    IconSortAscending2,
    IconSortDescending2,
} from "@tabler/icons-react";
import { useMemo } from "react";

type SortFilterProps<T> = {
    config: EntityFilterConfig<T>;
    value?: string;
    sortDir?: "asc" | "desc";
    onChange: (field?: string, dir?: "asc" | "desc") => void;
    className?: string;
};

function SortFilter<T>({
    config,
    value,
    sortDir,
    onChange,
    className = "",
}: SortFilterProps<T>) {
    const { t } = useTranslations();

    const sortOptions = useMemo(() => {
        return Object.entries(config)
            .filter(([, def]) => def.sortable)
            .flatMap(([field]) => [
                {
                    id: `${field}:asc`,
                    value: `${field}:asc`,
                    label: `${t(`attributes.${field}`)} (${t("asc")})`,
                    icon: <IconSortAscending2 className="size-4" />,
                },
                {
                    id: `${field}:desc`,
                    value: `${field}:desc`,
                    label: `${t(`attributes.${field}`)} (${t("desc")})`,
                    icon: <IconSortDescending2 className="size-4" />,
                },
            ]);
    }, [config, t]);

    return (
        <div className={className}>
            {/* <span className="flex h-4 w-10 text-xs text-text-subtle mt-1"></span> */}
            <Select
                name="sortBy"
                items={sortOptions}
                value={value && sortDir ? `${value}:${sortDir}` : ""}
                onChange={(v) => {
                    if (!v) {
                        onChange(undefined, undefined);
                    } else {
                        const [field, dir] = v.split(":");
                        onChange(field, dir as "asc" | "desc");
                    }
                }}
                className="shrink-0"
                allowClear={true}
                placeholder={
                    <div className="flex items-center gap-1 justify-center w-full">
                        <IconArrowsSort className="size-4" />
                        <span className="text-muted font-light hidden sm:inline">
                            {t("ui.default")}
                        </span>
                    </div>
                }
                hideArrow={true}
            />
        </div>
    );
}

export default SortFilter;
