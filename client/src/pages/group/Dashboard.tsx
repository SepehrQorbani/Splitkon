import { useGetSummary } from "@/api/queries/summary";
import AsyncContent from "@/components/common/AsyncContent";
import { DashboardSkeleton } from "@/components/features/dashboard/DashboardSkeleton";
import { ExpensesOverviewCard } from "@/components/features/dashboard/ExpensesOverviewCard";
import { GroupInfoCard } from "@/components/features/dashboard/GroupInfoCard";
import { MembersOverviewCard } from "@/components/features/dashboard/MembersOverviewCard";
import { OutstandingStatusCard } from "@/components/features/dashboard/OutstandingStatusCard";
import { RecentActivityCard } from "@/components/features/dashboard/RecentActivityCard";
import StatOverviewCard from "@/components/features/dashboard/StatOverviewCard";
import { useGroupStore } from "@/store";
import { useMemberStore } from "@/store/members";
import { Summary } from "@/types/schemas/summary";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

function Dashboard() {
    const { token } = useParams();
    const group = useGroupStore((state) => state.group);
    const members = useMemberStore((state) => state.members);
    const [summary, setSummary] = useState<Summary | null>(null);

    const {
        data: summaryData,
        isLoading,
        error,
        isError,
        refetch,
    } = useGetSummary(token as string);

    useEffect(() => {
        if (summaryData) {
            setSummary(summaryData.summary);
        }
    }, [summaryData]);

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
                        className=""
                    />
                    <StatOverviewCard
                        className="col-span-1"
                        summary={summary}
                    />
                    <ExpensesOverviewCard
                        className="col-span-1"
                        summary={summary}
                        groupToken={token!}
                    />
                    <RecentActivityCard
                        summary={summary}
                        className="col-span-1 md:col-span-2 lg:col-span-1"
                    />
                </div>
            )}
        </AsyncContent>
    );
}

export default Dashboard;
