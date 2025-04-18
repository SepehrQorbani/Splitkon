import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/utils/cn";
import {
    IconCheck,
    IconChevronDown,
    IconEqual,
    IconSquare,
    IconSquareCheck,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useMemo, useState, useEffect, memo } from "react";
import {
    DialogTrigger,
    GridList,
    GridListItem,
    Popover,
    Selection,
} from "react-aria-components";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import Avatar from "./Avatar";
import AvatarGroup from "./AvatarGroup";
import { Button } from "./Button";
import NumberField from "./NumberField";
import { Member, Members, MembersInput } from "@/types/schemas/members";

type ArrayFieldError = { [key: string]: FieldError }[] | undefined;

type SimpleMember = Omit<
    Member,
    "total_expenses" | "payment_balance" | "bank_info"
>;

interface MembersSelectProps {
    members: Members;
    name: string;
    label?: string;
    value: SimpleMember[];
    onChange: (value: SimpleMember[] | undefined) => void;
    isRequired?: boolean;
    className?: string;
    disabled?: boolean;
    error?: any;
    isInvalid?: boolean;
}

export default function MembersSelect({
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
}: MembersSelectProps) {
    const { t } = useTranslations();
    const isInvalid = externalInvalid || !!error;

    const [ratios, setRatios] = useState<Map<number, number>>(() => {
        const initialValue = value || [];
        return new Map(initialValue.map((m) => [m.id, m.ratio]));
        // return new Map(value.map((m) => [m.id, m.ratio || 1]));
    });

    // Memoize selectedIds to avoid recalculation
    const selectedIds = useMemo(() => new Set(value.map((m) => m.id)), [value]);
    const isAllSelected = useMemo(
        () => value.length === members.length && members.length > 0,
        [value.length, members.length]
    );

    // Sync ratios with value only when value changes
    // useEffect(() => {
    //     setRatios((prev) => {
    //         const updated = new Map(prev);
    //         value.forEach((m) => {
    //             if (!updated.has(m.id)) updated.set(m.id, m.ratio);
    //         });
    //         return updated;
    //     });
    // }, [value]);
    useEffect(() => {
        setRatios(new Map(value.map((m) => [m.id, m.ratio])));
    }, [value]);

    // Optimize selection change handler
    const handleSelectionChange = useCallback(
        (keys: Selection) => {
            const newSelectedIds = new Set(keys as Set<number>);
            const newSelected = members
                .filter((m) => newSelectedIds.has(m.id))
                .map((m) => ({
                    ...m,
                    ratio: ratios.get(m.id) ?? m.ratio ?? 1,
                }));

            setRatios((prev) => {
                const updated = new Map(prev);
                prev.forEach((_, id) => {
                    if (!newSelectedIds.has(id)) updated.delete(id);
                });
                return updated;
            });
            onChange(newSelected.length ? newSelected : []);
        },
        [members, ratios, onChange]
    );

    // Optimize select all handler
    const handleSelectAll = useCallback(() => {
        if (isAllSelected) {
            setRatios(new Map());
            onChange([]);
        } else {
            // onChange(members);
            const newMembers = members.map((m) => ({
                ...m,
                ratio: ratios.get(m.id) ?? m.ratio ?? 1,
            }));
            onChange?.(newMembers);
        }
    }, [isAllSelected, members, onChange, ratios]);

    // Optimize ratio change handler
    const handleRatioChange = useCallback(
        (memberId: number, ratio: number) => {
            setRatios((prev) => new Map(prev).set(memberId, ratio));
            onChange(
                value.map((m) => (m.id === memberId ? { ...m, ratio } : m))
            );
        },
        [value, onChange]
    );

    const handleEqualizeRatios = useCallback(() => {
        if (!value.length) return;
        const equalRatio = 1;

        setRatios((prev) => {
            const updated = new Map(prev);
            value.forEach((m) => updated.set(m.id, equalRatio));
            return updated;
        });
        onChange(value.map((m) => ({ ...m, ratio: equalRatio })));
    }, [value, onChange]);

    const summaryText = useMemo(() => {
        if (!value.length) return t("selectMembers") + "...";
        return isAllSelected ? t("all") : value.map((m) => m.name).join(", ");
    }, [value, isAllSelected, t]);

    const totalRatio = useMemo(
        () => value.reduce((sum, v) => sum + v.ratio, 0),
        [value]
    );

    return (
        <div className={cn("w-full relative flex flex-col gap-1", className)}>
            <DialogTrigger {...props}>
                {label && (
                    <label
                        className={cn(
                            "block text-xs text-text-subtle",
                            isRequired && isInvalid && "text-error font-medium"
                        )}
                    >
                        {label}
                    </label>
                )}
                <Button
                    isDisabled={disabled}
                    data-invalid={isInvalid}
                    variant="input"
                    className={cn(
                        "text-start text-xs px-2",
                        !isInvalid &&
                            "data-[pressed]:ring-action/30 data-[pressed]:border-action"
                    )}
                >
                    <div className="flex-1 truncate">
                        {value.length ? (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 truncate">
                                    <AvatarGroup
                                        members={value}
                                        size="sm"
                                        maxVisible={3}
                                    />
                                    <div className="truncate">
                                        {summaryText}
                                    </div>
                                </div>
                                <div className="text-xs text-muted shrink-0 ps-1">
                                    {value.length} {t("member")} ({" "}
                                    {t("splitBy")}
                                    {totalRatio} {t("person")} )
                                </div>
                            </div>
                        ) : (
                            <span className="text-muted">{summaryText}</span>
                        )}
                    </div>
                    <IconChevronDown className="w-4 h-4" />
                </Button>

                <Popover
                    placement="bottom"
                    className={cn(
                        "max-h-40 w-full max-w-md px-4 outline-none",
                        "data-[entering]:animate-slide-down-in data-[exiting]:animate-slide-up-out"
                    )}
                    style={{ direction: "inherit" }}
                >
                    <div className="max-h-40 overflow-auto rounded-md bg-surface shadow-input border border-border-input p-2">
                        <div className="flex gap-2 mb-2">
                            <Button onPress={handleSelectAll} size="icon">
                                {isAllSelected ? (
                                    <IconSquareCheck className="size-4" />
                                ) : (
                                    <IconSquare className="size-4" />
                                )}
                            </Button>
                            <Button
                                onPress={handleEqualizeRatios}
                                size="icon"
                                isDisabled={!value.length}
                            >
                                <IconEqual className="size-4" />
                            </Button>
                        </div>
                        <GridList
                            aria-label={name}
                            className="flex flex-col gap-2 p-1 outline-none"
                            selectedKeys={selectedIds}
                            selectionMode="multiple"
                            onSelectionChange={handleSelectionChange}
                        >
                            {members.map((item) => (
                                <GridListItem
                                    key={item.id}
                                    id={item.id}
                                    textValue={item.name}
                                    className={cn(
                                        "relative flex items-center h-12 p-1 gap-2 rounded cursor-pointer select-none group outline-none text-sm",
                                        "focus:ring-2 focus:ring-offset-surface focus:ring-action",
                                        selectedIds.has(item.id)
                                            ? "bg-action/15 border border-border"
                                            : ""
                                    )}
                                >
                                    <Avatar
                                        size="md"
                                        src={item.avatar}
                                        alt={`${item.name}'s avatar`}
                                    />
                                    <span className="flex-1">{item.name}</span>
                                    {selectedIds.has(item.id) && (
                                        <div
                                            onPointerDown={(e) =>
                                                e.stopPropagation()
                                            }
                                            onPointerUp={(e) =>
                                                e.stopPropagation()
                                            }
                                        >
                                            <NumberField
                                                name={`${name}-ratio-${item.id}`}
                                                value={
                                                    ratios.get(item.id) ??
                                                    item.ratio ??
                                                    1
                                                }
                                                onChange={(v) =>
                                                    handleRatioChange(
                                                        item.id,
                                                        v
                                                    )
                                                }
                                                aria-label="members-ratio"
                                                className="w-24"
                                                inputClassName="bg-surface/75 p-1 h-9"
                                                minValue={1}
                                            />
                                        </div>
                                    )}
                                    {selectedIds.has(item.id) && (
                                        <IconCheck className="size-8 p-1 text-action-fg bg-action/25 rounded absolute" />
                                    )}
                                </GridListItem>
                            ))}
                        </GridList>
                    </div>
                </Popover>
            </DialogTrigger>
            <AnimatePresence>
                {error?.message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-xs font-medium text-error absolute -bottom-1 end-0 w-full"
                    >
                        <span className="text-xs font-medium text-error absolute end-0">
                            {error.message}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
