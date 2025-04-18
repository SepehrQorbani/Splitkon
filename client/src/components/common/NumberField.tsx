import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/utils/cn";
import { defaultInputClass } from "@/utils/style";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import {
    NumberFieldProps as AriaNumberFieldProps,
    Group,
    Input,
    Label,
    NumberField as NumberFieldAria,
    Pressable,
} from "react-aria-components";
import { FieldError as HookFormFieldError } from "react-hook-form";
import { Button } from "./Button";

interface NumberFieldProps
    extends Omit<AriaNumberFieldProps, "value" | "onChange"> {
    name: string;
    label?: string;
    value?: number;
    onChange?: (value: number) => void;
    isRequired?: boolean;
    className?: string;
    inputClassName?: string;
    disabled?: boolean;
    error?: { message: string } | HookFormFieldError | undefined;
    placeholder?: string;
    ref?: React.Ref<HTMLInputElement>;
}

const NumberField = ({
    name,
    label,
    value,
    onChange,
    isRequired = false,
    className,
    inputClassName,
    disabled = false,
    error,
    placeholder,
    minValue,
    maxValue,
    isInvalid: externalInvalid,
    ref,
    ...props
}: NumberFieldProps) => {
    const { t } = useTranslations();

    const isInvalid = externalInvalid || !!error;
    // const resolvedLabel = label ?? t(`attributes.${name}`);
    const errorMessage = error?.message ? error.message : undefined;

    return (
        <NumberFieldAria
            name={name}
            value={value}
            onChange={onChange}
            isRequired={isRequired}
            isDisabled={disabled}
            isInvalid={isInvalid}
            minValue={minValue}
            maxValue={maxValue}
            className={cn("w-full relative flex flex-col gap-1", className)}
            {...props}
        >
            {label && (
                <Label
                    className={cn(
                        "block text-xs text-text-subtle",
                        isRequired && isInvalid && "text-error font-medium"
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
                    isDisabled={disabled}
                >
                    <IconMinus className="w-4 h-4" />
                </Button>
                <Input
                    ref={ref}
                    placeholder={placeholder}
                    className="w-full px-2 text-center outline-none bg-transparent"
                    dir="ltr"
                />
                <Button
                    variant="outline"
                    slot="increment"
                    className="w-6 h-6 p-0 shrink-0"
                    isDisabled={disabled}
                >
                    <IconPlus className="w-4 h-4" />
                </Button>
            </Group>

            {/* Error Message */}
            <AnimatePresence>
                {errorMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-xs font-medium text-error absolute -bottom-1 end-0 w-full"
                    >
                        <span className="text-xs font-medium text-error absolute end-0">
                            {errorMessage}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </NumberFieldAria>
    );
};

NumberField.displayName = "NumberField";

export default React.memo(NumberField);
