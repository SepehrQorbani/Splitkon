import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/utils/cn";
import { defaultInputClass } from "@/utils/style";
import { format, unformat, useMask } from "@react-input/mask";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { Input, Label, TextField, TextFieldProps } from "react-aria-components";
import { FieldError as HookFormFieldError } from "react-hook-form";
import BankLogo from "./BankLogo";

interface BankAccountInputFieldProps
    extends Omit<TextFieldProps, "value" | "onChange"> {
    name: string;
    label?: string;
    value?: string | null;
    onChange?: (value: string | undefined) => void;
    isRequired?: boolean;
    className?: string;
    inputClassName?: string;
    disabled?: boolean;
    error?: { message: string } | HookFormFieldError | undefined;
    placeholder?: string;
    ref?: React.Ref<HTMLInputElement>;
}

const BankAccountInputField = ({
    name,
    label,
    value = "",
    onChange,
    isRequired = false,
    className,
    inputClassName,
    disabled = false,
    error,
    placeholder = "xxxx-xxxx-xxxx-xxxx",
    isInvalid: externalInvalid,
    ref,
    ...props
}: BankAccountInputFieldProps) => {
    const { t } = useTranslations();

    const isInvalid = externalInvalid || !!error;
    const resolvedLabel = label ?? t(`attributes.${name}`);
    const errorMessage = error?.message ? error?.message : undefined;
    const maskOption = {
        mask: "____-____-____-____",
        replacement: { _: /\d/ },
        showMask: false,
    };
    const defaultValue = format(value ?? "", maskOption);
    const inputRef = useMask(maskOption);

    const handleChange = (formattedValue: string) => {
        const unformatValue = unformat(formattedValue, maskOption);

        onChange?.(unformatValue);
    };

    return (
        <TextField
            name={name}
            value={defaultValue}
            onChange={handleChange}
            isRequired={isRequired}
            isDisabled={disabled}
            isInvalid={isInvalid}
            className={cn("w-full relative flex flex-col gap-1", className)}
            {...props}
        >
            <Label
                className={cn(
                    "block text-xs text-text-subtle",
                    isInvalid && "text-error font-medium"
                )}
            >
                {resolvedLabel}
            </Label>

            <div className="relative flex items-center">
                <Input
                    ref={inputRef}
                    disabled={disabled}
                    placeholder={placeholder}
                    inputMode="numeric"
                    maxLength={19}
                    className={cn(
                        defaultInputClass,
                        "font-mono pr-20 text-left",
                        isInvalid && "border-error focus:ring-error",
                        inputClassName
                    )}
                    dir="ltr"
                />
                {value && value.length >= 6 && (
                    <BankLogo
                        className="flex items-center gap-1 absolute right-1 font-medium text-text-subtle border border-border bg-background p-0.5 rounded-md"
                        account={value}
                    />
                )}
            </div>

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
        </TextField>
    );
};

BankAccountInputField.displayName = "BankAccountInputField";

export default BankAccountInputField;
