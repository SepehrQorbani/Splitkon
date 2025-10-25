import { useTranslations } from "@/hooks/useTranslations";
import { useGroupStore } from "@/store";
import { RecentGroup, useRecentGroupsStore } from "@/store/recentGroups";
import { cn } from "@/utils/cn";
import { generateRecentGroupsReport } from "@/utils/reportGenerator";
import {
    IconChecks,
    IconDotsVertical,
    IconEye,
    IconEyeEdit,
    IconHistoryOff,
    IconListSearch,
    IconTrash,
    IconX,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import {
    Group,
    ListBox,
    ListBoxItem,
    MenuTrigger,
    Popover,
    Text,
} from "react-aria-components";
import { Link } from "react-router";
import { Button } from "./Button";
import { ConfirmableButton } from "./ConfirmableButton";
import CopyButton from "./CopyButton";
import { SearchFilter } from "./filters";

export function RecentGroupsList() {
    const { recentGroups } = useRecentGroupsStore();
    const currentGroup = useGroupStore((state) => state.group);
    const { t } = useTranslations();
    const [filterQ, setFilterQ] = useState("");

    const reportText = useMemo(() => {
        return generateRecentGroupsReport(Object.values(recentGroups), { t });
    }, [recentGroups, t]);

    const filterGroup = useMemo(() => {
        return Object.values(recentGroups).filter((g) =>
            g.title.toLowerCase().includes(filterQ.toLowerCase())
        );
    }, [recentGroups, filterQ]);

    if (Object.values(recentGroups).length === 0) {
        return (
            <Text className="text-gray-500 text-center py-4 flex flex-col items-center gap-2 text-xs">
                <IconHistoryOff className="size-4" />
                {t("noRecentGroups")}
            </Text>
        );
    }
    return (
        <>
            <div className="flex justify-between gap-1 mb-4 w-full">
                <SearchFilter
                    value={filterQ}
                    onChange={setFilterQ}
                    className="flex-1 w-full"
                />
                <CopyButton data={reportText} className="shrink-0 w-8" />
            </div>
            <ListBox
                aria-label={t("ui.recentGroup")}
                className="space-y-2 w-full max-w-md px-1 pb-2"
            >
                {filterGroup.length > 0 ? (
                    filterGroup.map((group) => {
                        const isCurrentGroup =
                            currentGroup && currentGroup.id === group.id;
                        return (
                            <ListBoxItem
                                key={group.id}
                                id={String(group.id)}
                                textValue={group.title}
                                className={cn(
                                    "flex justify-between gap-2 items-center p-2 rounded-lg border border-border focus:outline-none",
                                    !isCurrentGroup
                                        ? "hover:underline focus:ring-1 focus:ring-action"
                                        : "focus:ring-1 focus:ring-muted-soft"
                                )}
                            >
                                <Group className="flex flex-col text-action text-xs">
                                    {isCurrentGroup ? (
                                        <Text>{group.title}</Text>
                                    ) : (
                                        <Link
                                            to={`/${
                                                group.edit_token ??
                                                group.view_token
                                            }`}
                                        >
                                            {group.title}
                                        </Link>
                                    )}
                                </Group>
                                {!isCurrentGroup ? (
                                    <ActionMenu group={group} />
                                ) : (
                                    <Group>
                                        <div>
                                            <IconChecks className="size-8 p-2 text-muted" />
                                        </div>
                                    </Group>
                                )}
                            </ListBoxItem>
                        );
                    })
                ) : (
                    <ListBoxItem className="flex items-center gap-1 p-2 text-xs">
                        <IconListSearch className="size-4 text-action-soft" />
                        {t("ui.noFilterResult")}
                    </ListBoxItem>
                )}
            </ListBox>
        </>
    );
}

function ActionMenu({ group }: { group: RecentGroup }) {
    const { t, direction } = useTranslations();
    const [isOpen, setIsOpen] = useState(false);
    const removeRecentGroup = useRecentGroupsStore(
        (state) => state.removeRecentGroup
    );

    return (
        <MenuTrigger>
            <Button
                variant="input"
                intent="neutral"
                size="icon"
                aria-label="Menu"
                className={cn(
                    "transition-all text-action-soft",
                    isOpen && "text-action"
                )}
                onPress={() => {
                    setIsOpen((prevVal) => !prevVal);
                }}
            >
                <IconDotsVertical className="size-4" />
            </Button>
            <Popover
                dir={direction}
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                placement={direction === "ltr" ? "bottom end" : "bottom start"}
                className="p-2 border border-border overflow-auto select-none outline-none rounded bg-surface text-xs shadow-lg ring-0 data-[entering]:animate-slide-down-in data-[exiting]:animate-slide-up-out"
            >
                <div className="flex flex-col gap-2">
                    {group.edit_token && (
                        <Link
                            to={`/${group.edit_token}`}
                            className="flex justify-between items-center gap-2 p-2 hover:bg-action hover:text-action-fg rounded"
                        >
                            <IconEyeEdit className="size-4" />
                            <div>{t("ui.editLink")}</div>
                        </Link>
                    )}
                    {group.view_token && (
                        <Link
                            to={`/${group.view_token}`}
                            className="flex justify-between items-center gap-2 p-2 hover:bg-action hover:text-action-fg rounded"
                        >
                            <IconEye className="size-4" />
                            <div>{t("ui.viewLink")}</div>
                        </Link>
                    )}
                    <div className="flex justify-between items-center w-full">
                        <ConfirmableButton
                            onConfirm={() =>
                                removeRecentGroup(String(group.id))
                            }
                            confirm={
                                <div className="w-full flex gap-1">
                                    <IconTrash className="size-4" />
                                </div>
                            }
                            cancel={<IconX className="size-4" />}
                            size="icon"
                            variant="ghost"
                            intent="danger"
                            className="flex justify-between items-center gap-2 p-2 text-action w-full"
                        >
                            <IconTrash className="size-4 text-error shrink-0" />
                            <div className="text-error-soft">
                                {t("ui.removeFromList")}
                            </div>
                        </ConfirmableButton>
                    </div>
                </div>
            </Popover>
        </MenuTrigger>
    );
}
