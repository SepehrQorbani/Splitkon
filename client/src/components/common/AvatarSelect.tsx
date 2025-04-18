import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/utils/cn";
import { defaultInputClass } from "@/utils/style";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import {
    Select as AriaSelect,
    SelectProps as AriaSelectProps,
    Button,
    Label,
    ListBox,
    ListBoxItem,
    Popover,
    SelectValue,
} from "react-aria-components";
import { FieldError as HookFormFieldError } from "react-hook-form";

interface AvatarSelectProps
    extends Omit<AriaSelectProps, "value" | "onChange"> {
    name: string;
    label?: string;
    value?: string;
    onChange?: (value: string | undefined) => void;
    isRequired?: boolean;
    className?: string;
    disabled?: boolean;
    error?: { message: string } | HookFormFieldError | undefined;
    ref?: React.Ref<HTMLDivElement>;
}

interface AvatarItem {
    id: number;
    avatar: string;
}

const AvatarSelect = ({
    name,
    label,
    value,
    onChange,
    isRequired = false,
    className,
    disabled = false,
    error,
    isInvalid: externalInvalid,
    ref,
    ...props
}: AvatarSelectProps) => {
    const { t } = useTranslations();

    // Static avatar list
    const items: AvatarItem[] = Array.from({ length: 73 }, (_, i) => ({
        id: i + 1,
        avatar: `/images/avatars/set-01/Avatar${(i + 1)
            .toString()
            .padStart(2, "0")}.png`,
    }));

    const selectedItem = items.find((item) => item.avatar === value);
    const selectedKey = selectedItem ? selectedItem.id : null;
    const isInvalid = externalInvalid || !!error;
    const resolvedLabel = label ?? t(`attributes.${name}`);
    const errorMessage = error?.message
        ? t(error.message, { attribute: resolvedLabel })
        : undefined;

    return (
        <AriaSelect
            ref={ref}
            name={name}
            selectedKey={selectedKey}
            onSelectionChange={(key) => {
                const selected = items.find((item) => item.id === key);
                onChange?.(selected ? selected.avatar : undefined);
            }}
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

            <Button
                data-invalid={isInvalid}
                className={cn(
                    defaultInputClass,
                    "w-full h-10 py-1 flex justify-between items-center",
                    "data-[pressed]:ring-3 data-[pressed]:ring-action/30 data-[pressed]:border-action",
                    isInvalid && "border-error focus:ring-error"
                )}
            >
                <SelectValue className="inline-flex h-full aspect-square truncate shrink-0">
                    {({ isPlaceholder }) =>
                        isPlaceholder ? (
                            <span className="w-full h-full rounded-xl bg-muted/50" />
                        ) : (
                            <img
                                src={value}
                                alt="Selected avatar"
                                className="w-full h-full rounded-xl bg-muted/50 object-cover"
                            />
                        )
                    }
                </SelectValue>
                <IconChevronDown className="w-4 h-4" />
            </Button>

            <Popover
                placement="bottom end"
                className={cn(
                    "max-h-40 h-40 p-2 w-60 overflow-auto rounded-md bg-surface shadow-input border border-border-input",
                    "data-[placement=top]:data-[entering]:animate-slide-up-in data-[placement=bottom]:data-[entering]:animate-slide-down-in",
                    "data-[placement=top]:data-[exiting]:animate-slide-down-out data-[placement=bottom]:data-[exiting]:animate-slide-up-out"
                )}
            >
                <ListBox
                    className="grid grid-cols-4 gap-2 p-1 outline-none"
                    layout="grid"
                    items={items}
                >
                    {(item) => (
                        <ListBoxItem
                            id={item.id}
                            textValue={`Avatar ${item.id}`}
                            className="relative flex items-center w-10 h-10 gap-2 rounded-xl cursor-pointer select-none group outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-action"
                        >
                            {({ isSelected }) => (
                                <>
                                    <img
                                        src={item.avatar}
                                        alt={`Avatar ${item.id}`}
                                        className="w-full h-full rounded-xl bg-muted object-cover"
                                    />
                                    {isSelected && (
                                        <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-foreground/40">
                                            <IconCheck className="w-5 h-5 stroke-surface" />
                                        </span>
                                    )}
                                </>
                            )}
                        </ListBoxItem>
                    )}
                </ListBox>
            </Popover>

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
        </AriaSelect>
    );
};

AvatarSelect.displayName = "AvatarSelect";

export default React.memo(AvatarSelect);
