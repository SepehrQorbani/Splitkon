import { useTranslations } from "@/hooks/useTranslations";
import { Member, Members } from "@/types/schemas/members";
import { cn } from "@/utils/cn";
import {
    IconCheck,
    IconChevronDown,
    IconCurrencyDollar,
    IconEqual,
    IconSquare,
    IconSquareCheck,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    DialogTrigger,
    GridList,
    GridListItem,
    Popover,
    Selection,
} from "react-aria-components";
import AmountField from "./AmountField";
import Avatar from "./Avatar";
import AvatarGroup from "./AvatarGroup";
import { Button } from "./Button";
import NumberField from "./NumberField";

type SimpleMember = Omit<
    Member,
    "total_expenses" | "payment_balance" | "bank_info"
> & { share?: number | null };

interface MembersSelectProps {
    members: Members;
    name: string;
    label?: string;
    value?: SimpleMember[];
    shareType: "ratio" | "amount";
    onChange: (value: SimpleMember[]) => void;
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
    shareType,
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

    const [internalValue, setInternalValue] = useState<SimpleMember[]>(
        value ?? []
    );
    const [internalShareType, setInternalShareType] = useState<
        "ratio" | "amount"
    >(shareType);

    useEffect(() => {
        setInternalValue(value ?? []);
    }, [value]);

    useEffect(() => {
        setInternalShareType(shareType);
    }, [shareType]);

    const handleClose = useCallback(() => {
        if (internalValue !== value) {
            onChange(internalValue);
        }
    }, [internalValue, value, internalShareType, shareType, onChange]);

    const selectedIds = useMemo(
        () => new Set(internalValue.map((m) => m.id)),
        [internalValue]
    );
    const isAllSelected =
        internalValue.length === members.length && members.length > 0;

    const summaryDisplay = useMemo(() => {
        if (!internalValue.length) return t("selectMembers") + "...";

        let suffix = "";
        if (internalShareType === "ratio") {
            const total = internalValue.reduce(
                (sum, v) => sum + (v.ratio ?? 1),
                0
            );
            suffix = `(${t("splitBy")} ${total} ${t("person")})`;
        } else {
            const total = internalValue.reduce(
                (sum, v) => sum + (v.share ?? 0),
                0
            );
            suffix = `(${t("amount")} ${total.toLocaleString()} ${t(
                "currency"
            )})`;
        }

        const names = isAllSelected
            ? t("all")
            : internalValue.map((m) => m.name).join(", ");
        return `${names} ${suffix}`;
    }, [internalValue, isAllSelected, internalShareType, t]);

    const handleToggleShareType = useCallback(() => {
        setInternalShareType((prev) => {
            const newType = prev === "ratio" ? "amount" : "ratio";

            const updated = internalValue.map((member) => {
                if (newType === "ratio") {
                    return {
                        ...member,
                        ratio: member.ratio ?? 1,
                        share: undefined,
                    };
                } else {
                    return {
                        ...member,
                        share: member.share ?? undefined,
                        ratio: null,
                    };
                }
            });

            setInternalValue(updated);
            return newType;
        });
    }, [internalValue]);

    const handleSelectionChange = useCallback(
        (keys: Selection) => {
            const newSelectedIds = new Set(keys as Set<number>);
            const prevMemberMap = new Map(internalValue.map((m) => [m.id, m]));
            const newSelected = members
                .filter((m) => newSelectedIds.has(m.id))
                .map((m) => {
                    const prevMember = prevMemberMap.get(m.id);
                    if (internalShareType === "ratio") {
                        return {
                            ...m,
                            ratio: prevMember?.ratio ?? 1,
                            share: undefined,
                        };
                    } else {
                        return {
                            ...m,
                            share: prevMember?.share ?? undefined,
                            ratio: null,
                        };
                    }
                });

            setInternalValue(newSelected);
        },
        [members, internalValue, internalShareType]
    );

    const handleSelectAll = useCallback(() => {
        console.log(isAllSelected);
        if (isAllSelected) {
            setInternalValue([]);
            return;
        }
        const prevMemberMap = new Map(internalValue.map((m) => [m.id, m]));

        const newSelected = members.map((m) => {
            const prevMember = prevMemberMap.get(m.id);
            if (internalShareType === "ratio") {
                return {
                    ...m,
                    ratio: prevMember?.ratio ?? 1,
                    share: undefined,
                };
            } else {
                return {
                    ...m,
                    share: prevMember?.share ?? undefined,
                    ratio: null,
                };
            }
        });

        setInternalValue(newSelected);
    }, [members, internalValue, internalShareType]);

    const handleEqualizeRatios = useCallback(() => {
        if (internalShareType !== "ratio") return;

        const equalized = internalValue.map((member) => ({
            ...member,
            ratio: 1,
        }));

        setInternalValue(equalized);
    }, [internalValue, internalShareType]);

    return (
        <div className={cn("w-full relative flex flex-col gap-1", className)}>
            <DialogTrigger
                {...props}
                onOpenChange={(isOpen) => {
                    if (!isOpen) {
                        handleClose();
                    }
                }}
            >
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
                        {internalValue.length ? (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 truncate">
                                    <AvatarGroup
                                        members={internalValue}
                                        size="sm"
                                        maxVisible={3}
                                    />
                                    <div className="truncate">
                                        {summaryDisplay}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <span className="text-muted">{summaryDisplay}</span>
                        )}
                    </div>
                    <IconChevronDown className="w-4 h-4" />
                </Button>

                <Popover
                    placement="bottom"
                    onOpenChange={(isOpen) => {
                        if (!isOpen) handleClose();
                    }}
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
                            {internalShareType === "ratio" && (
                                <Button
                                    onPress={handleEqualizeRatios}
                                    size="icon"
                                    isDisabled={!internalValue.length}
                                >
                                    <IconEqual className="size-4" />
                                </Button>
                            )}
                            <Button
                                onPress={handleToggleShareType}
                                size="icon"
                                isDisabled={!internalValue.length}
                            >
                                <IconCurrencyDollar className="size-4" />
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
                                        >
                                            {internalShareType === "ratio" ? (
                                                <NumberField
                                                    name={`${name}-ratio-${item.id}`}
                                                    value={
                                                        internalValue.find(
                                                            (v) =>
                                                                v.id === item.id
                                                        )?.ratio ?? 1
                                                    }
                                                    onChange={(v) =>
                                                        setInternalValue(
                                                            internalValue.map(
                                                                (m) =>
                                                                    m.id ===
                                                                    item.id
                                                                        ? {
                                                                              ...m,
                                                                              ratio: v,
                                                                              share: undefined,
                                                                          }
                                                                        : m
                                                            )
                                                        )
                                                    }
                                                    className="w-24"
                                                    inputClassName="bg-surface/75 p-1 h-9"
                                                    minValue={1}
                                                />
                                            ) : (
                                                <AmountField
                                                    name={`${name}-ratio-${item.id}`}
                                                    showWord={false}
                                                    value={
                                                        internalValue.find(
                                                            (v) =>
                                                                v.id === item.id
                                                        )?.share ?? undefined
                                                    }
                                                    onChange={(v) =>
                                                        setInternalValue(
                                                            internalValue.map(
                                                                (m) =>
                                                                    m.id ===
                                                                    item.id
                                                                        ? {
                                                                              ...m,
                                                                              share: v,
                                                                              ratio: null,
                                                                          }
                                                                        : m
                                                            )
                                                        )
                                                    }
                                                    className="w-48"
                                                    inputClassName="bg-surface/75 p-1 h-9"
                                                />
                                            )}
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
