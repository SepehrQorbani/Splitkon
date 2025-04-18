import {
    Label,
    ListBox,
    ListBoxItem,
    Popover,
    Select,
    SelectValue,
} from "react-aria-components";
import { Button } from "./Button";
import { cn } from "@/utils/cn";
import Avatar from "./Avatar";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "@/hooks/useTranslations";
import { Member, Members } from "@/types/schemas/members";

interface MemberSelectProps {
    members: Members;
    name: string;
    label?: string;
    value: number;
    onChange: (value: number) => void;
    isRequired?: boolean;
    className?: string;
    disabled?: boolean;
    error?: any;
    isInvalid?: boolean;
}

function MemberSelect({
    members,
    name,
    label,
    value,
    onChange,
    isRequired = false,
    className,
    disabled = false,
    error,
    isInvalid: externalInvalid,
    ...props
}: MemberSelectProps) {
    const { t } = useTranslations();
    const isInvalid = externalInvalid || !!error;
    const errorMessage = error?.message ? error.message : undefined;

    return (
        <Select
            onSelectionChange={(key) => {
                onChange(key as number);
            }}
            selectedKey={value}
            className="relative"
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
                    "text-start text-xs px-2 mt-1",
                    !isInvalid &&
                        " data-[pressed]:ring-action/30 data-[pressed]:border-action"
                )}
            >
                <SelectValue className="w-full">
                    {({ selectedItem, isPlaceholder }) => {
                        const item = selectedItem as Member;
                        return isPlaceholder ? (
                            <div className="flex items-center gap-1">
                                <Avatar
                                    size="sm"
                                    className="rounded-full"
                                    alt={item?.name}
                                />
                                <span className="text-muted font-light">
                                    {t("selectMember")}
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1">
                                <Avatar
                                    size="sm"
                                    className="rounded-full"
                                    src={item?.avatar}
                                    alt={item?.name}
                                />
                                <span>{item?.name}</span>
                            </div>
                        );
                    }}
                </SelectValue>
                <IconChevronDown className="w-4 h-4" />
            </Button>
            <Popover
                className={cn(
                    "max-h-40 h-40 w-full max-w-md px-4 outline-none",
                    "data-[entering]:animate-slide-down-in data-[exiting]:animate-slide-up-out"
                )}
                style={{ direction: "inherit" }}
                placement="bottom"
            >
                <ListBox
                    items={members}
                    className="max-h-full overflow-auto rounded-md bg-surface shadow-input border border-border-input space-y-1 outline-none p-1"
                >
                    {(item) => (
                        <ListBoxItem
                            id={item.id}
                            textValue={item.name}
                            className={({ isSelected }) =>
                                cn(
                                    "relative flex items-center h-12 p-1 gap-2 rounded cursor-pointer select-none group outline-none text-sm",
                                    "focus:ring-2 focus:ring-offset-surface focus:ring-action",
                                    isSelected
                                        ? "bg-action/15 border border-border"
                                        : ""
                                )
                            }
                        >
                            {({ isSelected }) => (
                                <>
                                    <Avatar
                                        size="md"
                                        src={item.avatar}
                                        alt={`${item.name}'s avatar`}
                                    />
                                    <span className="flex-1">{item.name}</span>
                                    {isSelected && (
                                        <IconCheck className="size-8 p-1 text-action-fg bg-action/25 rounded absolute" />
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
        </Select>
    );
}

export default MemberSelect;
