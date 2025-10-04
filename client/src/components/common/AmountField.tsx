import { useTranslations } from "@/hooks/useTranslations";
import { useGroupStore } from "@/store";
import { cn } from "@/utils/cn";
import { defaultInputClass } from "@/utils/style";
import { InputNumberFormat, unformat } from "@react-input/number-format";
import { IconX } from "@tabler/icons-react"; // ⬅️ تغییر جدید (اضافه شدن IconX)
import { AnimatePresence, motion } from "motion/react";
import React, { useCallback } from "react";
import {
    Group,
    Input,
    Label,
    NumberField as NumberFieldAria,
    TextFieldProps,
} from "react-aria-components";
import { FieldError as HookFormFieldError } from "react-hook-form";
import Amount from "./Amount";

interface AmountFieldProps extends Omit<TextFieldProps, "value" | "onChange"> {
    name: string;
    label?: string;
    value?: number;
    onChange?: (value: number | undefined) => void;
    isRequired?: boolean;
    className?: string;
    inputClassName?: string;
    disabled?: boolean;
    error?: { message: string } | HookFormFieldError | undefined;
    placeholder?: string;
    minValue?: number;
    maxValue?: number;
    ref?: React.Ref<HTMLInputElement>;
    showWord?: boolean;
    allowClear?: boolean;
}

const AmountField = ({
    value,
    onChange,
    isRequired = false,
    className,
    error,
    minValue,
    maxValue,
    isInvalid: externalInvalid,
    ref,
    showWord = true,
    allowClear = false,
    ...props
}: AmountFieldProps) => {
    const isInvalid = externalInvalid || !!error;
    const errorMessage = error?.message ? error.message : undefined;

    const handleInput = useCallback(
        (value?: string | number) => {
            const raw = unformat(String(value), "en").trim();
            if (!raw) {
                onChange?.(undefined);
                return;
            }

            const parsed = parseInt(raw);

            if (!isNaN(parsed)) {
                if (minValue !== undefined && parsed < minValue) {
                    onChange?.(minValue);
                } else if (maxValue !== undefined && parsed > maxValue) {
                    onChange?.(maxValue);
                } else {
                    onChange?.(parsed);
                }
            }
        },
        [onChange, minValue, maxValue]
    );

    return (
        <div className={cn("w-full relative flex flex-col gap-1", className)}>
            <InputNumberFormat
                ref={ref}
                value={value}
                defaultValue={value}
                locales="en"
                className="w-full"
                data-required={isRequired || undefined}
                data-invalid={isInvalid || undefined}
                maximumIntegerDigits={16}
                minimumIntegerDigits={1}
                component={AmountFieldComponent}
                onChange={handleInput}
                isInvalid={isInvalid}
                allowClear={allowClear}
                onClear={() => onChange?.(undefined)}
                {...props}
            />
            {showWord && (
                <div>
                    <Amount amount={isInvalid ? "" : value} word={true} />
                </div>
            )}

            {/* Error Message */}
            <AnimatePresence>
                {errorMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={cn(
                            "text-xs font-medium text-error absolute end-0 w-full",
                            showWord && isInvalid ? "bottom-5" : "-bottom-1"
                        )}
                    >
                        <span className="text-xs font-medium text-error absolute end-0">
                            {errorMessage}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

AmountField.displayName = "AmountField";

export default AmountField;

interface AmountFieldComponentProps {
    name: string;
    label?: string;
    value?: number;
    onChange: (value?: string | number) => void;
    className?: string;
    inputClassName?: string;
    disabled?: boolean;
    placeholder?: string;
    minValue?: number;
    maxValue?: number;
    isRequired?: boolean;
    isInvalid?: boolean;
    ref?: React.Ref<HTMLInputElement>;
    allowClear?: boolean;
    onClear?: () => void;
    [key: string]: any;
}

const AmountFieldComponent = ({
    name,
    label,
    value,
    onChange,
    className,
    inputClassName,
    disabled = false,
    placeholder,
    minValue = 1,
    maxValue = Number.MAX_SAFE_INTEGER,
    isRequired = false,
    isInvalid,
    ref,
    allowClear = false,
    onClear,
    ...props
}: AmountFieldComponentProps) => {
    const { t } = useTranslations();
    const unit = useGroupStore((state) => state.currency?.display_unit);

    return (
        <NumberFieldAria
            onInput={(v) => onChange(v.currentTarget.value)}
            value={value}
            onChange={onChange}
            isRequired={isRequired}
            isDisabled={disabled}
            isInvalid={isInvalid}
            minValue={minValue}
            maxValue={maxValue}
            className={cn("w-full relative flex flex-col gap-1", className)}
            aria-label={label || t("attributes.amount")}
            {...props}
        >
            {label && (
                <Label
                    className={cn(
                        "block text-xs text-text-subtle",
                        isInvalid && "text-error font-medium"
                    )}
                >
                    {label}
                </Label>
            )}

            <Group
                className={cn(
                    defaultInputClass,
                    "flex items-center justify-between relative",
                    isInvalid && "border-error focus-within:ring-error",
                    inputClassName
                )}
            >
                <Input
                    ref={ref}
                    placeholder={placeholder}
                    className="w-full px-2 text-center outline-none bg-transparent"
                    dir="ltr"
                    name={name}
                />

                {allowClear && value !== undefined && !disabled && (
                    <AnimatePresence>
                        <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onClear?.();
                            }}
                            className="rounded-full border border-action text-action hover:bg-action hover:text-action-fg cursor-pointer"
                        >
                            <IconX className="size-4 p-0.5 transition-all" />
                        </motion.button>
                    </AnimatePresence>
                )}
                <Label className="ps-2 text-xs text-muted">
                    {unit && t(unit)}
                </Label>
            </Group>
        </NumberFieldAria>
    );
};
