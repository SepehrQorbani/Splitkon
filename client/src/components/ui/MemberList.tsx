import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/utils/cn";
import { Member } from "@/utils/schema";
import {
    IconCancel,
    IconCashBanknote,
    IconPencil,
    IconTrash,
    IconUserOff,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { GridList, GridListItem, GridListProps } from "react-aria-components";
import { Button } from "./Button";
// const MotionGridListItem = motion(GridListItem);
interface MemberListProps
    extends Omit<GridListProps<Member>, "items" | "children"> {
    members: Member[];
    selectedMember: Member["id"] | undefined;
    onSelectMember: (id: Member["id"] | undefined) => void;
    onDeleteMember: (id: Member["id"]) => void;
    disabled?: boolean;
    className?: string;
}

// Plain function instead of React.FC for modern practice
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
        <>
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
                    "w-full overflow-auto bg-surface-strong/25 p-2 flex flex-col gap-2 outline-none",
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
                                    "flex justify-between items-center p-2 rounded"
                                )}
                            >
                                <div>
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={item.avatar}
                                            alt={item.name}
                                            className="w-10 h-10 rounded-xl bg-gray-200 object-cover"
                                        />
                                        <span>{item.name}</span>
                                        <span className="text-sm text-gray-500 ps-2">
                                            ({item.ratio} نفر)
                                        </span>
                                    </div>
                                    {item.bank_info && (
                                        <div className="flex items-center gap-2 text-sm text-gray-500 ps-12">
                                            <span className="flex items-center gap-1 text-gray-500 text-xs">
                                                <IconCashBanknote className="w-4 h-4" />
                                                {t("attributes.bank_info")}
                                            </span>
                                            <span>({item.bank_info})</span>
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
        </>
    );
}

MemberList.displayName = "MemberList";

export default MemberList;
