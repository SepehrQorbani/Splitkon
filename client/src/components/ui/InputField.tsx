import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/utils/cn";
import { defaultInputClass } from "@/utils/style";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import {
    Input,
    Label,
    TextArea,
    TextField,
    TextFieldProps,
} from "react-aria-components";
import { FieldError as HookFormFieldError } from "react-hook-form";

interface InputFieldProps extends Omit<TextFieldProps, "value" | "onChange"> {
    name: string;
    label?: string;
    value?: string;
    onChange?: (value: string) => void;
    isRequired?: boolean;
    className?: string;
    inputClassName?: string;
    multiline?: boolean;
    disabled?: boolean;
    error?: { message: string } | HookFormFieldError | undefined;
    placeholder?: string;
    ref?: React.Ref<HTMLInputElement | HTMLTextAreaElement>;
}

const InputField = ({
    name,
    label,
    value,
    onChange,
    isRequired = false,
    className,
    inputClassName,
    multiline = false,
    disabled = false,
    error,
    placeholder,
    isInvalid: externalInvalid,
    ref,
    ...props
}: InputFieldProps) => {
    const { t } = useTranslations();

    const isInvalid = externalInvalid || !!error;

    const resolvedLabel = label ?? t(`attributes.${name}`);

    const errorMessage = error?.message
        ? t(error.message, { attribute: resolvedLabel })
        : undefined;

    return (
        <TextField
            name={name}
            value={value}
            onChange={onChange}
            isRequired={isRequired}
            isDisabled={disabled}
            isInvalid={isInvalid}
            className={cn("w-full relative flex flex-col gap-1", className)}
            {...props}
        >
            <Label
                className={cn(
                    "block text-sm font-medium text-text-subtle",
                    isRequired &&
                        isInvalid &&
                        "after:content-['*'] after:text-red-500 after:ml-1"
                )}
            >
                {resolvedLabel}
            </Label>

            {multiline ? (
                <TextArea
                    ref={ref as React.Ref<HTMLTextAreaElement>}
                    disabled={disabled}
                    placeholder={placeholder ?? t(`attributes.${name}`)}
                    className={cn(
                        defaultInputClass,
                        "min-h-[80px] resize-y",
                        isInvalid && "border-error focus:ring-error",
                        inputClassName
                    )}
                />
            ) : (
                <Input
                    ref={ref as React.Ref<HTMLInputElement>}
                    disabled={disabled}
                    placeholder={placeholder ?? t(`attributes.${name}`)}
                    className={cn(
                        defaultInputClass,
                        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                        isInvalid && "border-error focus:ring-error",
                        inputClassName
                    )}
                />
            )}

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
InputField.displayName = "InputField";

export default React.memo(InputField);
