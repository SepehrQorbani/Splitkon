import Amount from "@/components/common/Amount";
import Avatar from "@/components/common/Avatar";
import ProgressBar from "@/components/common/ProgressBar";
import { useTranslations } from "@/hooks/useTranslations";
import { Member } from "@/types";
import { cn } from "@/utils/cn";
import { IconChecks, IconUserOff, IconUsers } from "@tabler/icons-react";

export const GroupMembersCard = ({ members }: { members: Member[] }) => {
    const { t } = useTranslations();

    return (
        <div className="w-full px-2 bg-background rounded-md border border-border">
            <div className="text-xs font-bold ps-1 py-2 border-b border-border flex items-center gap-1">
                <IconUsers className="size-3" />
                {t("ui.status")} {t("ui.members")}
            </div>
            {members.length > 0 ? (
                members.map((member) => {
                    return (
                        <div
                            key={member.id}
                            className="border-t border-border overflow-clip p-4 flex flex-col gap-2"
                        >
                            <div className="flex justify-between items-center relative">
                                <span
                                    className={cn(
                                        "w-1 absolute inset-0 my-3 ms-1 rounded",
                                        `bg-${member.status?.title}`
                                    )}
                                ></span>
                                <div className="flex items-center gap-2">
                                    <Avatar
                                        alt={member.name}
                                        size="sm"
                                        src={member.avatar}
                                    />
                                    <span className="text-xs">
                                        {member.name}
                                    </span>
                                </div>
                                <div>
                                    {member.status?.net === 0 ? (
                                        <IconChecks
                                            className="size-4 border-none"
                                            strokeWidth={1.5}
                                        />
                                    ) : (
                                        <Amount
                                            amount={member.status?.net ?? 0}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div
                                    className={`flex items-center justify-end gap-1 text-xs text-${member.status?.title} font-bold`}
                                >
                                    <span
                                        className={`size-2 rounded-full bg-${member.status?.title}-subtle border border-${member.status?.title}`}
                                    />
                                    <span>
                                        {t(member.status?.title || "settled")}
                                    </span>
                                </div>
                                <div>
                                    {member?.status && (
                                        <ProgressBar
                                            className="w-32 p-0"
                                            value={member.status.percent}
                                            color={member.status.title}
                                            remainFlag={
                                                member.status.percent < 100
                                            }
                                            remainColor="settled"
                                            percentageMode="inline"
                                            aria-label={`member-${member.id}-progressbar`}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="flex items-center gap-1 text-[10px] text-muted p-4">
                    <IconUserOff className="size-3.5" />
                    <div className="shrink-0">{t("ui.noMember")}</div>
                </div>
            )}
        </div>
    );
};
