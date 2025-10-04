import AmountField from "@/components/common/AmountField";
import { useTranslations } from "@/hooks/useTranslations";

type RangeFilterProps = {
    field: string;
    label: string;
    value?: { min?: number; max?: number };
    onChange: (min?: number, max?: number) => void;
    className?: string;
};

function RangeFilter({
    field,
    label,
    value,
    onChange,
    className = "",
}: RangeFilterProps) {
    const { t } = useTranslations();

    return (
        <div className={className}>
            <label className="block text-xs text-text-subtle mb-1">
                {label}
            </label>

            <div className="flex items-center gap-2">
                <AmountField
                    name={`${field}-min`}
                    className="w-60"
                    placeholder={t("ui.from")}
                    value={value?.min ?? undefined}
                    onChange={(v) => {
                        onChange(v, value?.max);
                    }}
                    showWord={false}
                    allowClear={true}
                />
                <AmountField
                    name={`${field}-max`}
                    className="w-60"
                    placeholder={t("ui.to")}
                    value={value?.max ?? undefined}
                    onChange={(v) => {
                        onChange(value?.min, v);
                    }}
                    showWord={false}
                    allowClear={true}
                />
            </div>
        </div>
    );
}

export default RangeFilter;
