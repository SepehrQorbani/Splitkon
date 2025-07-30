import Avatar from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";
import { ConfirmableButton } from "@/components/common/ConfirmableButton";
import CopyButton from "@/components/common/CopyButton";
import { useTranslations } from "@/hooks/useTranslations";
import { Member, MemberInput, MembersInput } from "@/types/schemas/members";
import { hasRole } from "@/utils/checkRoles";
import { cn } from "@/utils/cn";
import {
    IconCancel,
    IconCreditCard,
    IconCurrencyDollar,
    IconCurrencyDollarOff,
    IconMoneybag,
    IconPencil,
    IconTrash,
    IconUserOff,
    IconUsersGroup,
    IconX,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo } from "react";
import {
    GridList,
    GridListItem,
    GridListProps,
    Heading,
} from "react-aria-components";

interface MemberListProps
    extends Omit<GridListProps<MemberInput | Member>, "items" | "children"> {
    members: MembersInput;
    // selectedMember: Member["id"] | MemberInput["id"] | undefined;
    // onSelectMember: (id: Member["id"] | MemberInput["id"] | undefined) => void;
    selectedMember: Member | MemberInput | null | undefined;
    onSelectMember: (member: Member | MemberInput | null | undefined) => void;
    onAddMember: (member: MemberInput) => void;
    onUpdateMember: (member: Member | MemberInput) => void;
    onDeleteMember: (id: Member["id"] | MemberInput["id"]) => void;
    disabled?: boolean;
    className?: string;
}

export function MemberList({
    members,
    selectedMember,
    onSelectMember,
    onAddMember,
    onUpdateMember,
    onDeleteMember,
    disabled = false,
    className,
    ...props
}: MemberListProps) {
    const { t } = useTranslations();
    // const walletMember = members?.find((m) => hasRole("wallet", m));
    const defaultPayer = members?.find((m) => hasRole("default", m));

    const totalRatio = useMemo(
        () => members.reduce((pv, cv) => cv.ratio + pv, 0),
        [members]
    );

    return (
        <div>
            <div className="flex items-center gap-1">
                <IconUsersGroup className="size-4" />
                <Heading className="py-2 font-semibold">لیست اعضا</Heading>
            </div>
            <div className="p-2 bg-background rounded-t flex justify-between border border-border border-b-0">
                <div></div>

                <div className="flex gap-2">
                    {/* <Button
                        size="sm"
                        className="text-xs font-light"
                        onPress={() => {
                            onAddMember({
                                avatar: "/images/avatars/treasury/Group05.png",
                                name: t("wallet"),
                                ratio: 0,
                                bank_info: "",
                                role: 2,
                            });
                        }}
                        isDisabled={!!walletMember}
                    >
                        <IconWallet className="size-4" />
                        group found
                    </Button> */}
                    <Button
                        size="sm"
                        className="text-xs font-light"
                        onPress={() => {
                            selectedMember &&
                                onUpdateMember({
                                    ...selectedMember,
                                    role: (selectedMember?.role ?? 0) ^ 1,
                                });
                        }}
                        isDisabled={
                            !selectedMember ||
                            (!!defaultPayer &&
                                defaultPayer.id !== selectedMember.id)
                        }
                    >
                        {!!defaultPayer ? (
                            <IconCurrencyDollarOff className="size-4" />
                        ) : (
                            <IconCurrencyDollar className="size-4" />
                        )}
                        {t("ui.roles.defaultPayer")}
                    </Button>
                </div>
            </div>
            <GridList
                items={members}
                selectionMode="single"
                selectionBehavior="toggle"
                selectedKeys={
                    selectedMember && selectedMember.id
                        ? new Set([selectedMember.id])
                        : new Set()
                }
                onSelectionChange={(keys) => {
                    const [id] = keys as Set<string>;

                    const selected = members.find((m) => m.id && m.id === id);
                    onSelectMember(selected);
                }}
                aria-label={t("attributes.members")}
                className={cn(
                    "w-full overflow-auto p-1 flex flex-col gap-2 outline-none border border-border",
                    className
                )}
                renderEmptyState={() => (
                    <motion.div
                        layout
                        layoutId="empty-state"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 0.2,
                            ease: [0.4, 0, 0.2, 1],
                        }}
                        className="flex items-center gap-2 p-2"
                    >
                        <span className="w-10 h-10 rounded-xl bg-surface-strong flex items-center justify-center">
                            <IconUserOff className="size-4" />
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
                                exit={{ opacity: 0 }}
                                transition={{
                                    duration: 0.2,
                                    ease: [0.4, 0, 0.2, 1],
                                }}
                                className={cn(
                                    "flex justify-between items-center p-2 rounded gap-2 relative"
                                )}
                            >
                                <div className="w-full overflow-x-auto overflow-y-hidden">
                                    <div className="flex items-center gap-2">
                                        <div className="relative rounded overflow-clip">
                                            <Avatar
                                                src={item.avatar}
                                                alt={`${item.name}'s avatar`}
                                                fallback={item.name}
                                            />
                                            <div>
                                                {selectedMember?.id ===
                                                    item.id && (
                                                    <IconPencil className="size-8 p-2 bg-action/60 text-action-fg absolute inset-0 transition-all animate-slide-down-in" />
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-xs flex items-center gap-1">
                                                {item.name}

                                                {hasRole("wallet", item) && (
                                                    <IconMoneybag className="size-4 bg-action p-0.5 text-action-faint rounded-full" />
                                                )}
                                                {hasRole("default", item) && (
                                                    <IconCurrencyDollar
                                                        stroke={2.5}
                                                        className="size-4 bg-action p-0.5 text-action-faint rounded-full"
                                                    />
                                                )}
                                            </div>
                                            <div className="text-[10px] text-gray-500 pt-1">
                                                <span className="font-semibold pe-1">
                                                    {item.ratio}
                                                </span>
                                                {t("ratioUnit")}
                                            </div>
                                        </div>
                                        {item.bank_info && (
                                            <div className="flex items-center gap-2 text-nowrap text-xs bg-background rounded py-0.5 ps-0.5 pe-3 ms-auto">
                                                <CopyButton
                                                    data={item.bank_info}
                                                    className="size-8 text-muted shrink-0"
                                                    copyIcon={IconCreditCard}
                                                />
                                                <span
                                                    className="shrink-0"
                                                    dir="ltr"
                                                >
                                                    {item.bank_info.replace(
                                                        /(\S{4})(?=\S)/g,
                                                        "$1 "
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2 mb-auto">
                                    <Button
                                        className="w-8 h-8 p-0"
                                        isDisabled={disabled}
                                        variant={
                                            selectedMember?.id === item.id
                                                ? "solid"
                                                : "ghost"
                                        }
                                        intent="primary"
                                        onPress={() =>
                                            selectedMember?.id === item.id
                                                ? onSelectMember(undefined)
                                                : onSelectMember(item)
                                        }
                                    >
                                        {selectedMember?.id === item.id ? (
                                            <IconCancel className="size-4" />
                                        ) : (
                                            <IconPencil className="size-4" />
                                        )}
                                    </Button>
                                    <ConfirmableButton
                                        onConfirm={() =>
                                            onDeleteMember(item.id)
                                        }
                                        confirm={
                                            <IconTrash className="size-4" />
                                        }
                                        cancel={<IconX className="size-4" />}
                                        size="icon"
                                        variant="ghost"
                                        intent="danger"
                                        isDisabled={
                                            selectedMember?.id === item.id
                                        }
                                    >
                                        <IconTrash className="size-4" />
                                    </ConfirmableButton>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </GridListItem>
                ))}
            </GridList>
            <div className="px-4 py-2 bg-background rounded-b flex justify-between border border-border border-t-0">
                <div>
                    <span className="text-xs text-muted me-2">
                        {t("ui.membersCount")}:
                    </span>
                    <span className="text-sm">
                        {members.length}
                        {/* {!!walletMember ? members.length - 1 : members.length} */}
                    </span>
                </div>
                <div>
                    <span className="text-xs text-muted me-2">
                        {t("ui.totalRatio")}:
                    </span>
                    <span className="text-sm">{totalRatio}</span>
                </div>
            </div>
        </div>
    );
}

MemberList.displayName = "MemberList";

export default MemberList;
