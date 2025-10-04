import Select, { SelectItem } from "@/components/common/Select";
import ToggleButtonGroup from "@/components/common/ToggleButtonGroup";
import { useTranslations } from "@/hooks/useTranslations";
import { defaultInputClass } from "@/utils/style";
import { useMediaQuery } from "@uidotdev/usehooks";

type EnumFilterProps = {
    field: string;
    label: string;
    value?: string | string[];
    options: Array<{ id: string; label: string; count?: number }>;
    onChange: (value: string | string[] | null) => void;
    showToggle?: boolean;
    className?: string;
};

function EnumFilter({
    field,
    label,
    value,
    options,
    onChange,
    showToggle = false,
    className = "",
}: EnumFilterProps) {
    const { t } = useTranslations();
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const toggleButtons = [
        ...options.map((option) => ({
            id: option.id,
            icon: (
                <div className="flex gap-1 items-center">
                    <span
                        className={`size-2 rounded-full bg-${option.id}-subtle border border-${option.id}`}
                    ></span>
                    <span className="text-xs">
                        {`${option.label} (${option.count})`}
                    </span>
                </div>
            ),
        })),
    ];

    const selectOptions: SelectItem[] = options.map((option) => ({
        id: option.id,
        value: option.id,
        label: option.count
            ? `${option.label} (${option.count})`
            : option.label,
    }));

    return (
        <div className={className}>
            {/* <label className="block text-xs text-text-subtle mb-1">
                {label}
            </label> */}
            {isDesktop ? (
                <ToggleButtonGroup
                    buttons={toggleButtons}
                    value={
                        value ? (Array.isArray(value) ? value : [value]) : null
                    }
                    onChange={(v) => {
                        onChange(v);
                    }}
                    clearable={true}
                    multiple={true}
                    className={defaultInputClass}
                />
            ) : (
                <Select
                    // label={label}
                    name={field}
                    items={selectOptions}
                    value={Array.isArray(value) ? value[0] : value || ""}
                    onChange={(v) => {
                        onChange(v || null);
                    }}
                    className="w-64- shrink-0"
                    allowClear={true}
                    placeholder={t("ui.all")}
                />
            )}
        </div>
    );
}

export default EnumFilter;
