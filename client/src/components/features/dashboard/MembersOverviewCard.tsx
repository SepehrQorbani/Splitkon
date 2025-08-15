import Amount from "@/components/common/Amount";
import Avatar from "@/components/common/Avatar";
import { Card } from "@/components/common/Card";
import MembersStatusChart from "@/components/features/dashboard/MembersStatusChart";
import { useTranslations } from "@/hooks/useTranslations";
import { Member } from "@/types";
import { Summary } from "@/types/schemas/summary";
import { cn } from "@/utils/cn";
import {
    IconChecks,
    IconPercentage,
    IconUser,
    IconUsers,
} from "@tabler/icons-react";
import { FC } from "react";

interface MembersOverviewCardProps {
    summary: Summary;
    members: Member[];
    className?: string;
}

export const MembersOverviewCard: FC<MembersOverviewCardProps> = ({
    summary,
    members,
    className,
}) => {
    const { t } = useTranslations();
    const memberBalanceDistribution = summary?.net_balances.reduce(
        (prev, curr) => {
            if (curr.net > 0)
                return {
                    ...prev,
                    creditors: prev.creditors + 1,
                    balanced: prev.balanced - 1,
                };
            else if (curr.net < 0)
                return {
                    ...prev,
                    debtors: prev.debtors + 1,
                    balanced: prev.balanced - 1,
                };
            else return prev;
        },
        {
            creditors: 0,
            debtors: 0,
            balanced: summary.members_count,
        }
    ) || {
        creditors: 0,
        debtors: 0,
        balanced: summary?.members_count || 0,
    };
    return (
        <Card className={cn(className)}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <IconUsers className="w-12 h-12 p-3 rounded text-muted-fg bg-action" />
                    <div className="flex flex-col justify-between">
                        <h4 className="text-sm font-medium ">
                            {t("ui.members")}
                        </h4>
                        <div>
                            <span className="text-sm">
                                {summary.members_count}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-between">
                    <h4 className="text-sm font-medium ">
                        {t("ui.totalRatio")}
                    </h4>
                    <div className="flex gap-1 items-center">
                        <IconPercentage className="size-4 text-muted-soft" />
                        <span className="text-sm">
                            {summary.total_ratio.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            {members?.length > 0 ? (
                <>
                    <MembersStatusChart
                        membersCount={summary.members_count}
                        memberBalanceDistribution={memberBalanceDistribution}
                    />
                    <div className="max-h-48 overflow-y-auto border border-border rounded">
                        {members.map((member) => {
                            return (
                                <div
                                    key={member.id}
                                    className="flex justify-between items-center relative px-4 py-4 last:border-none border-b border-border overflow-clip"
                                >
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
                                                className="size-4"
                                                strokeWidth={1.5}
                                            />
                                        ) : (
                                            <Amount
                                                amount={member.status?.net ?? 0}
                                            />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center gap-4 text-muted-soft text-xs bg-linear-0 from-muted-fg\0 to-muted-fg rounded h-full w-full p-4">
                    <div className="flex justify-between items-center bg-surface border border-border gap-1 rounded-lg  p-1.5">
                        <IconUser className="size-4 p-0.5 bg-action-faint border border-border rounded-full" />
                        <span className="bg-action-subtle h-1 w-8 rounded me-auto"></span>
                    </div>

                    <p className="text-center">{t("ui.noMember")}</p>
                </div>
            )}
        </Card>
    );
};
