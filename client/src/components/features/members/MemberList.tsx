import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/utils/cn";
import { Member, MemberInput, MembersInput } from "@/types/schemas/members";
import {
    IconCancel,
    IconCashBanknote,
    IconPencil,
    IconTrash,
    IconUserOff,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { GridList, GridListItem, GridListProps } from "react-aria-components";
import { Button } from "../../common/Button";

interface MemberListProps
    extends Omit<GridListProps<MemberInput | Member>, "items" | "children"> {
    members: MembersInput;
    selectedMember: Member["id"] | MemberInput["id"] | undefined;
    onSelectMember: (id: Member["id"] | MemberInput["id"] | undefined) => void;
    onDeleteMember: (id: Member["id"] | MemberInput["id"]) => void;
    disabled?: boolean;
    className?: string;
}

export function MemberList({
    members,
    selectedMember,
    onSelectMember,
    onDeleteMember,
    disabled = false,
    className,
    ...props
}: MemberListProps) {
    const { t } = useTranslations();

    return (
        <div>
            <div className="px-4 py-2 bg-background rounded-t flex justify-between border border-border">
                <div>
                    <span className="text-xs text-muted me-2">
                        {t("ui.membersCount")}:
                    </span>
                    <span className="text-sm">{members.length}</span>
                </div>
                <div>
                    <span className="text-xs text-muted me-2">
                        {t("ui.totalRatio")}:
                    </span>
                    <span className="text-sm">
                        {members.reduce((pv, cv) => cv.ratio + pv, 0)}
                    </span>
                </div>
            </div>
            <GridList
                items={members}
                selectionMode="single"
                selectedKeys={
                    selectedMember ? new Set([selectedMember]) : new Set()
                }
                selectionBehavior="toggle"
                onSelectionChange={(keys) => {
                    const [id] = keys as Set<string>;
                    onSelectMember(id);
                }}
                aria-label={t("attributes.members")}
                className={cn(
                    "w-full overflow-auto p-2 flex flex-col gap-2 outline-none border border-border border-t-0 rounded-b",
                    className
                )}
                renderEmptyState={() => (
                    <motion.div
                        layout
                        layoutId="empty-state"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{
                            duration: 0.3,
                            ease: "easeInOut",
                        }}
                        className="flex items-center gap-2 p-2"
                    >
                        <span className="w-10 h-10 rounded-xl bg-surface-strong flex items-center justify-center">
                            <IconUserOff className="w-4 h-4" />
                        </span>
                        <span className="text-sm text-text-subtle">
                            {t("messages.noMembersAdded")}
                        </span>
                    </motion.div>
                )}
                {...props}
            >
                {members.map((item) => (
                    <GridListItem
                        key={item.id}
                        id={item.id}
                        textValue={item.name}
                        className="rounded hover:bg-background focus:bg-background  focus:outline-none data-[selected]:ring-2 data-[selected]:ring-action transition-all duration-200"
                    >
                        <AnimatePresence mode="popLayout">
                            <motion.div
                                layout
                                layoutId={`member-${item.id}`}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{
                                    duration: 0.3,
                                    ease: "easeInOut",
                                }}
                                className={cn(
                                    "flex justify-between items-center p-2 rounded gap-2"
                                )}
                            >
                                <div className="w-full overflow-x-auto overflow-y-hidden">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={item.avatar}
                                            alt={item.name}
                                            className="w-10 h-10 rounded-xl bg-gray-200 object-cover"
                                        />
                                        <span className="text-xs">
                                            {item.name}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            ({item.ratio} نفر)
                                        </span>
                                    </div>
                                    {item.bank_info && (
                                        <div className="flex items-center gap-2 text-sm text-gray-500 ms-12">
                                            <span className="flex items-center gap-1 text-gray-500 text-xs shrink-0">
                                                <IconCashBanknote className="w-4 h-4" />
                                                {t("attributes.bank_info")}
                                            </span>
                                            <span className="shrink-0">
                                                ({item.bank_info})
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        className="w-8 h-8 p-0"
                                        isDisabled={disabled}
                                        variant={
                                            selectedMember === item.id
                                                ? "solid"
                                                : "outline"
                                        }
                                        intent={
                                            selectedMember === item.id
                                                ? "danger"
                                                : "primary"
                                        }
                                        onPress={() =>
                                            selectedMember === item.id
                                                ? onSelectMember(undefined)
                                                : onSelectMember(item.id)
                                        }
                                    >
                                        {selectedMember === item.id ? (
                                            <IconCancel className="w-4 h-4" />
                                        ) : (
                                            <IconPencil className="w-4 h-4" />
                                        )}
                                    </Button>
                                    <Button
                                        onPress={() => onDeleteMember(item.id)}
                                        isDisabled={disabled}
                                        className="w-8 h-8 p-0"
                                        variant="outline"
                                        intent="danger"
                                    >
                                        <IconTrash className="w-4 h-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </GridListItem>
                ))}
            </GridList>
        </div>
    );
}

MemberList.displayName = "MemberList";

export default MemberList;
