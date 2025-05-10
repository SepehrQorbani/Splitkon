import { getSummary } from "@/api/endpoints/summary";
import AsyncContent from "@/components/common/AsyncContent";
import { Card } from "@/components/common/Card";
import { DashboardSkeleton } from "@/components/features/dashboard/DashboardSkeleton";
import { ExpensesOverviewCard } from "@/components/features/dashboard/ExpensesOverviewCard";
import { MembersOverviewCard } from "@/components/features/dashboard/MembersOverviewCard";
import { OutstandingStatusCard } from "@/components/features/dashboard/OutstandingStatusCard";
import { RecentActivityCard } from "@/components/features/dashboard/RecentActivityCard";
import { useReportGenerator } from "@/hooks/useReportGenerator";
import { useTranslations } from "@/hooks/useTranslations";
import { useGroupStore } from "@/store";
import { useMemberStore } from "@/store/members";
import { Summary } from "@/types/schemas/summary";
import { diffInDays } from "@/utils/date";
import { GroupInfoCard } from "@/components/features/dashboard/GroupInfoCard";

import {
    IconCalendarBolt,
    IconCalendarPause,
    IconScript,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

function Dashboard() {
    const { t, formatDate, formatDaysToWords } = useTranslations();
    const { token } = useParams();
    const { direction } = useTranslations();
    const group = useGroupStore((state) => state.group);
    const members = useMemberStore((state) => state.members);
    const [summary, setSummary] = useState<Summary | null>(null);

    const {
        data: summaryData,
        isLoading,
        error,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["summary", token],
        queryFn: () => getSummary(token as string),
        enabled: !!token,
    });

    useEffect(() => {
        if (summaryData) {
            setSummary(summaryData.summary);
        }
    }, [summaryData]);
    const { generateGroupReport } = useReportGenerator();

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
        <AsyncContent
            isLoading={isLoading}
            error={error}
            refetch={refetch}
            skeleton={<DashboardSkeleton />}
        >
            {summary && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <GroupInfoCard
                        group={group}
                        className="col-span-1 md:col-span-2 lg:col-span-1"
                    />

                    <OutstandingStatusCard summary={summary} className="" />
                    <MembersOverviewCard
                        summary={summary}
                        members={members}
                        memberBalanceDistribution={memberBalanceDistribution}
                        className=""
                    />

                    <ExpensesOverviewCard
                        className="col-span-1 md:col-span-2"
                        summary={summary}
                        groupToken={token!}
                    />
                    <RecentActivityCard
                        summary={summary}
                        className="md:col-span-2 lg:col-span-1"
                    />
                </div>
            )}
        </AsyncContent>
    );
}

export default Dashboard;
