import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/utils/cn";
import { defaultInputClass } from "@/utils/style";
import { IconBuildingBank } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { Input, Label, TextField, TextFieldProps } from "react-aria-components";
import { FieldError as HookFormFieldError } from "react-hook-form";

const BankInfo: Record<string, { name: string; logo?: string | null }> = {
    "603799": { name: "melli" },
    "170019": { name: "melli" },
    "589210": { name: "sepah" },
    "627648": { name: "saderat" },
    "603769": { name: "keshavarzi" },
    "639217": { name: "keshavarzi" },
    "628023": { name: "maskan" },
    "627381": { name: "ansar" },
    "636214": { name: "ayandeh" },
    "502938": { name: "day" },
    "627412": { name: "eghtesad" },
    "505416": { name: "gardeshgari" },
    "505426": { name: "gardeshgari" },
    "639599": { name: "ghavamin" },
    "505785": { name: "iranzamin" },
    "627488": { name: "karafarin" },
    "585949": { name: "khavarmiyaneh" },
    "639370": { name: "mehreqtesad" },
    "610433": { name: "mellat" },
    "991975": { name: "mellat" },
    "622106": { name: "parsian" },
    "627884": { name: "parsian" },
    "502229": { name: "pasargad" },
    "639347": { name: "pasargad" },
    "627760": { name: "postbank" },
    "589463": { name: "refah" },
    "504172": { name: "resalat" },
    "621986": { name: "saman" },
    "627961": { name: "sanatmadan" },
    "639607": { name: "sarmaye" },
    "502806": { name: "shahr" },
    "504706": { name: "shahr" },
    "639346": { name: "sina" },
    "585983": { name: "tejarat" },
    "627353": { name: "tejarat" },
    "502908": { name: "tosehe" },
    "207177": { name: "toseesaderat" },
    "636949": { name: "hekmat" },
    "636797": { name: "markazi" },
    "606373": { name: "mehriran" },
    "505801": { name: "kosar" },
    "606256": { name: "melal" },
    "628157": { name: "tosee" },
};

interface BankAccountInputFieldProps
    extends Omit<TextFieldProps, "value" | "onChange"> {
    name: string;
    label?: string;
    value?: string; // Raw digits (e.g., "1234123412341234")
    onChange?: (value: string) => void; // Returns raw digits
    isRequired?: boolean;
    className?: string;
    inputClassName?: string;
    disabled?: boolean;
    error?: { message: string } | HookFormFieldError | undefined;
    placeholder?: string;
    ref?: React.Ref<HTMLInputElement>;
}

const formatBankAccountNumber = (value: string): string => {
    const digits = value.replace(/\D/g, ""); // Remove non-digits
    const parts = [];
    for (let i = 0; i < digits.length; i += 4) {
        parts.push(digits.slice(i, i + 4));
    }
    return parts.join("-").slice(0, 19); // Limit to "xxxx-xxxx-xxxx-xxxx"
};

const parseBankAccountNumber = (value: string): string => {
    return value.replace(/\D/g, ""); // Return only digits
};

const getBankInfo = (digits: string) => {
    const prefix = digits.slice(0, 6);
    return BankInfo[prefix] || null;
};

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
    const errorMessage = error?.message
        ? t(error.message, { attribute: resolvedLabel })
        : undefined;
    const handleChange = (formattedValue: string) => {
        const rawValue = parseBankAccountNumber(formattedValue);
        if (rawValue.length <= 16) {
            // Limit to 16 digits
            onChange?.(rawValue);
        }
    };
    const displayedValue = formatBankAccountNumber(value);
    const bankInfo = value.length >= 6 ? getBankInfo(value) : null;

    return (
        <TextField
            name={name}
            value={displayedValue}
            onChange={handleChange}
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
                        "after:content-['*'] after:text-red-500 after:ml-1"
                )}
            >
                {resolvedLabel}
            </Label>

            <div className="relative flex items-center">
                <Input
                    ref={ref}
                    disabled={disabled}
                    placeholder={placeholder}
                    maxLength={19}
                    className={cn(
                        defaultInputClass,
                        "font-mono pr-20 text-left",
                        isInvalid && "border-error focus:ring-error",
                        inputClassName
                    )}
                    dir="ltr"
                />
                {value.length >= 6 && (
                    <span className="flex items-center gap-1 absolute right-1 text-[10px] font-medium text-text-subtle border border-border bg-background p-0.5 rounded-md">
                        {bankInfo ? (
                            <>
                                <img
                                    src={`/images/bank-logo/${bankInfo.name}.png`}
                                    alt={bankInfo.name}
                                    className=" w-6 h-6 object-contain"
                                />
                                {/* {t(`banks.${bankInfo.name}`)} */}
                            </>
                        ) : (
                            <>
                                <IconBuildingBank className="w-6 h-6 p-1" />
                                {/* {t("banks.unknown")} */}
                            </>
                        )}
                    </span>
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

export default React.memo(BankAccountInputField);
