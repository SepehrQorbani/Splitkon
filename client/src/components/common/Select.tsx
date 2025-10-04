import { cn } from "@/utils/cn";
import { IconCheck, IconChevronDown, IconX } from "@tabler/icons-react";
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
    placeholder?: React.ReactNode;
    allowClear?: boolean;
    hideArrow?: boolean;
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
    allowClear = false,
    hideArrow = false,
    ...props
}: SelectProps) {
    const isInvalid = externalInvalid || !!error;
    const errorMessage = error?.message ? error.message : undefined;

    const selectedItem =
        value === undefined
            ? undefined
            : items.find((item) => {
                  if (typeof item.value === "object" && item.value !== null) {
                      return (
                          JSON.stringify(item.value) === JSON.stringify(value)
                      );
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
            selectedKey={selectedItem ? selectedItem.id : null}
            className={cn("relative w-full", className)}
            aria-label={label || name}
        >
            {label && (
                <Label
                    className={cn(
                        "block text-xs text-text-subtle mt-1",
                        isRequired && isInvalid && "text-error font-medium"
                    )}
                >
                    {label}
                </Label>
            )}
            <div className="relative w-full flex items-center">
                <Button
                    isDisabled={disabled}
                    data-invalid={isInvalid}
                    variant="input"
                    className={cn(
                        "flex-1 text-start text-xs px-2",
                        !isInvalid &&
                            " data-[pressed]:ring-action/30 data-[pressed]:border-action"
                    )}
                >
                    <SelectValue className="w-full">
                        {({ selectedItem, isPlaceholder }) => {
                            const item = selectedItem as SelectItem;
                            if (isPlaceholder) {
                                return (
                                    <div className="flex items-center gap-1">
                                        {placeholder &&
                                            (typeof placeholder === "string" ? (
                                                <span className="text-muted font-light">
                                                    {placeholder}
                                                </span>
                                            ) : (
                                                placeholder
                                            ))}
                                    </div>
                                );
                            }

                            return (
                                <div
                                    className={cn(
                                        "flex items-center gap-1",
                                        allowClear &&
                                            selectedItem &&
                                            !disabled &&
                                            hideArrow &&
                                            "me-6 shrink-0"
                                    )}
                                >
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
                    {!hideArrow && (
                        <IconChevronDown
                            className={cn(
                                "w-4 h-4",
                                allowClear &&
                                    selectedItem &&
                                    !disabled &&
                                    "ms-8 shrink-0"
                            )}
                        />
                    )}
                </Button>

                {allowClear && selectedItem && !disabled && (
                    // <AnimatePresence>
                    <button
                        // initial={{ scale: 0 }}
                        // animate={{ scale: 1 }}
                        // exit={{ scale: 0 }}
                        type="reset"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onChange(undefined);
                        }}
                        // size="icon"
                        // variant="ghost"
                        className={cn(
                            "absolute cursor-pointer p-1 group",
                            hideArrow ? "end-2" : "end-6"
                        )}
                    >
                        <IconX className="size-4 p-0.5 transition-all border border-action rounded-full text-action group-hover:bg-action group-hover:text-action-fg" />
                    </button>
                    // </AnimatePresence>
                )}
            </div>

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
                                                "end-1 bg-action size-6"
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
