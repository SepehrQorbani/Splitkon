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
    Collection,
    Header,
    Label,
    ListBox,
    ListBoxItem,
    ListBoxSection,
    Popover,
    SelectValue,
} from "react-aria-components";
import { FieldError as HookFormFieldError } from "react-hook-form";
import Avatar from "./Avatar";
import { avatarCollections } from "@/constants/avatars";

interface AvatarSelectProps
    extends Omit<AriaSelectProps, "value" | "onChange"> {
    name: string;
    label?: string;
    value?: string | null;
    onChange?: (value: string | undefined) => void;
    isRequired?: boolean;
    fallback?: string;
    className?: string;
    disabled?: boolean;
    error?: { message: string } | HookFormFieldError | undefined;
    ref?: React.Ref<HTMLDivElement>;
}

const AvatarSelect = ({
    name,
    label,
    value,
    onChange,
    isRequired = false,
    fallback = "",
    className,
    disabled = false,
    error,
    isInvalid: externalInvalid,
    ref,
    ...props
}: AvatarSelectProps) => {
    const { t, direction } = useTranslations();

    const flatItems = avatarCollections.flatMap((items) => items.children);
    const selectedItem = flatItems.find((item) => item.avatar === value);
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
                const selected = flatItems.find((item) => item.id === key);
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
                            <Avatar className="w-full h-full rounded" />
                        ) : (
                            <Avatar
                                src={value}
                                alt="Selected avatar"
                                fallback={false}
                                className="w-full h-full rounded"
                            />
                        )
                    }
                </SelectValue>
                <IconChevronDown className="w-4 h-4" />
            </Button>

            <Popover
                placement={`bottom ${direction === "rtl" ? "end" : "start"}`}
                className={cn(
                    "max-h-40 h-40 p-1 w-60 overflow-auto rounded-md bg-surface shadow-input border border-border-input",
                    "data-[placement=top]:data-[entering]:animate-slide-up-in data-[placement=bottom]:data-[entering]:animate-slide-down-in",
                    "data-[placement=top]:data-[exiting]:animate-slide-down-out data-[placement=bottom]:data-[exiting]:animate-slide-up-out"
                )}
            >
                <div dir={direction}>
                    <ListBox
                        className="outline-none space-y-2"
                        layout="grid"
                        items={avatarCollections}
                    >
                        {(section) => (
                            <ListBoxSection
                                id={section.name}
                                className="grid grid-cols-4 gap-2 p-2"
                            >
                                <Header className="text-xs text-action font-medium col-span-4">
                                    {t(`ui.avatarCollections.${section.name}`)}
                                </Header>
                                <Collection items={section.children}>
                                    {(item) => (
                                        <ListBoxItem
                                            id={item.id}
                                            textValue={`Avatar ${item.id}`}
                                            className="relative flex items-center w-10 h-10 rounded cursor-pointer select-none group outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-action"
                                        >
                                            {({ isSelected }) => (
                                                <>
                                                    <Avatar
                                                        src={item.avatar}
                                                        alt={`Avatar ${item.id}`}
                                                        fallback={false}
                                                        className="w-full h-full rounded bg-action-subtle object-cover"
                                                    />
                                                    {isSelected && (
                                                        <span className="absolute inset-2 flex items-center justify-center rounded-full bg-action/75 ring-2 ring-action-fg">
                                                            <IconCheck className="w-5 h-5 stroke-action-fg" />
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </ListBoxItem>
                                    )}
                                </Collection>
                            </ListBoxSection>
                        )}
                    </ListBox>
                </div>
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
