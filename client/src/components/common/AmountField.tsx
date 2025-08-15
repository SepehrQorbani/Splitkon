import { useTranslations } from "@/hooks/useTranslations";
import { useGroupStore } from "@/store";
import { cn } from "@/utils/cn";
import { defaultInputClass } from "@/utils/style";
import { InputNumberFormat, unformat } from "@react-input/number-format";
import { IconMinus, IconPlus } from "@tabler/icons-react";
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
import { Button } from "./Button";

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
                {...props}
            />
            <div>
                <Amount amount={isInvalid ? "" : value} word={true} />
            </div>

            {/* Error Message */}
            <AnimatePresence>
                {errorMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-xs font-medium text-error absolute bottom-5 end-0 w-full"
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
    inputRef,
    ref,
    ...props
}: AmountFieldComponentProps) => {
    const { t } = useTranslations();
    const unit = useGroupStore((state) => state.currency?.display_unit);

    return (
        <NumberFieldAria
            onInput={(v) => onChange(v.currentTarget.value)}
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
                    "flex items-center justify-between",
                    isInvalid && "border-error focus-within:ring-error",
                    inputClassName
                )}
            >
                <Button
                    variant="outline"
                    slot="decrement"
                    className="w-6 h-6 p-0 shrink-0"
                    isDisabled={disabled || value === minValue}
                >
                    <IconMinus className="w-4 h-4" />
                </Button>
                <Input
                    ref={ref}
                    placeholder={placeholder}
                    className="w-full px-2 text-center outline-none bg-transparent"
                    dir="ltr"
                    name={name}
                />
                <span className="px-2 text-xs text-muted">
                    {unit && t(unit)}
                </span>
                <Button
                    variant="outline"
                    slot="increment"
                    className="w-6 h-6 p-0 shrink-0"
                    isDisabled={disabled || value === maxValue}
                >
                    <IconPlus className="w-4 h-4" />
                </Button>
            </Group>
        </NumberFieldAria>
    );
};
