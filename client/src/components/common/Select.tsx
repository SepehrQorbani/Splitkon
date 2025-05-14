import { cn } from "@/utils/cn";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import {
    Select as AriaSelect,
    Label,
    ListBox,
    ListBoxItem,
    Popover,
    SelectValue,
} from "react-aria-components";
import { Button } from "./Button";

export interface SelectItem {
    id: string | number;
    label: string;
    icon?: React.ReactNode;
    value: any;
}

interface SelectProps {
    items: SelectItem[];
    name: string;
    label?: string;
    value: any;
    onChange: (value: any) => void;
    isRequired?: boolean;
    className?: string;
    disabled?: boolean;
    error?: any;
    isInvalid?: boolean;
    placeholder?: string;
}

function Select({
    items,
    name,
    label,
    value,
    onChange,
    isRequired = false,
    className,
    disabled = false,
    error,
    isInvalid: externalInvalid,
    placeholder,
    ...props
}: SelectProps) {
    const isInvalid = externalInvalid || !!error;
    const errorMessage = error?.message ? error.message : undefined;

    const selectedItem = items.find((item) => {
        if (typeof item.value === "object" && item.value !== null) {
            return JSON.stringify(item.value) === JSON.stringify(value);
        }
        return item.value === value;
    });

    return (
        <AriaSelect
            onSelectionChange={(key) => {
                const item = items.find((item) => item.id === key);
                if (item) {
                    onChange(item.value);
                }
            }}
            selectedKey={selectedItem?.id}
            className="relative w-full"
        >
            <Label
                className={cn(
                    "block text-xs text-text-subtle",
                    isRequired && isInvalid && "text-error font-medium"
                )}
            >
                {label}
            </Label>
            <Button
                isDisabled={disabled}
                data-invalid={isInvalid}
                variant="input"
                className={cn(
                    "text-start text-xs px-2",
                    !isInvalid &&
                        " data-[pressed]:ring-action/30 data-[pressed]:border-action"
                )}
            >
                <SelectValue className="w-full">
                    {({ selectedItem, isPlaceholder }) => {
                        const item = selectedItem as SelectItem;
                        return isPlaceholder ? (
                            <div className="flex items-center gap-1">
                                {placeholder && (
                                    <span className="text-muted font-light">
                                        {placeholder}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-1">
                                {item?.icon && (
                                    <span className="flex items-center">
                                        {item.icon}
                                    </span>
                                )}
                                <span>{item?.label}</span>
                            </div>
                        );
                    }}
                </SelectValue>
                <IconChevronDown className="w-4 h-4" />
            </Button>
            <Popover
                className={cn(
                    "max-h-40 h-40 w-52 px-4- outline-none",
                    "data-[entering]:animate-slide-down-in data-[exiting]:animate-slide-up-out"
                )}
                style={{ direction: "inherit" }}
                placement="bottom"
            >
                <ListBox
                    items={items}
                    className="max-h-full overflow-auto rounded-md bg-surface shadow-input border border-border-input space-y-1 outline-none p-1"
                >
                    {(item) => (
                        <ListBoxItem
                            id={item.id}
                            textValue={item.label}
                            className={({ isSelected }) =>
                                cn(
                                    "relative flex items-center h-10 p-1 gap-2 rounded cursor-pointer select-none group outline-none text-sm",
                                    "focus:ring-2 focus:ring-offset-surface focus:ring-action",
                                    isSelected
                                        ? "bg-action/15 border border-border"
                                        : ""
                                )
                            }
                        >
                            {({ isSelected }) => (
                                <>
                                    {item.icon && (
                                        <span className="flex items-center">
                                            {item.icon}
                                        </span>
                                    )}
                                    <span className="flex-1">{item.label}</span>
                                    {isSelected && (
                                        <IconCheck
                                            className={cn(
                                                "p-1 text-action-fg rounded absolute",
                                                item.icon
                                                    ? "bg-action/50 size-8"
                                                    : "end-1 bg-action size-6"
                                            )}
                                        />
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
}

export default Select;
