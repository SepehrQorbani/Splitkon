import { getSummary } from "@/api/endpoints/summary";
import { AsyncContent } from "@/components/common/AsyncContent";
import Avatar from "@/components/common/Avatar";
import { Card } from "@/components/common/Card";
import CopyButton from "@/components/common/CopyButton";
import ProgressBar from "@/components/common/ProgressBar";
import ToggleButtonGroup from "@/components/common/ToggleButtonGroup";
import BalanceCard from "@/components/features/balance/BalanceCard";
import { DashboardSkeleton } from "@/components/features/dashboard/DashboardSkeleton";
import MembersStatusChart from "@/components/features/dashboard/MembersStatusChart";
import { DailyExpenseChart } from "@/components/features/expenses/DailyExpenseChart";
import { useReportGenerator } from "@/hooks/useReportGenerator";
import { useTranslations } from "@/hooks/useTranslations";
import { useMemberStore } from "@/store/members";
import { Summary } from "@/types/schemas/summary";
import { cn } from "@/utils/cn";
import {
    IconAbacus,
    IconActivity,
    IconArrowLeft,
    IconArrowRight,
    IconCash,
    IconChartArea,
    IconChartArrowsVertical,
    IconChartBar,
    IconChartLine,
    IconCongruentTo,
    IconPercentage,
    IconPlusEqual,
    IconTimelineEvent,
    IconTransfer,
    IconUser,
    IconUsers,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

function Dashboard() {
    const { t, formatDate } = useTranslations();
    const { token } = useParams();
    const { direction } = useTranslations();
    const members = useMemberStore((state) => state.members);
    const [summary, setSummary] = useState<Summary | null>(null);
    const [chartType, setChartType] = useState<"area" | "line" | "bar">("area");

    const {
        data: summaryData,
        isLoading,
        error,
        isError,
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
            loadingMessage={t("ui.loading")}
            errorMessage={t("ui.errorFetchingData")}
            skeleton={<DashboardSkeleton />}
        >
            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <IconAbacus className="w-12 h-12 p-3 rounded text-muted-fg bg-action" />
                                    <div className="flex flex-col justify-between">
                                        <h4 className="text-sm font-medium space-x-1">
                                            <span>{t("groupStatus")}</span>
                                            <CopyButton
                                                data={generateGroupReport(
                                                    summary
                                                )}
                                            />
                                        </h4>
                                        <div>
                                            <span className="text-sm">
                                                {summary.balance_status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-between">
                                    {/* <div className="h-40 w-52 flex items-center justify-center">
                                        <PieChart />
                                    </div> */}
                                    <h4 className="text-sm font-medium ">
                                        {t("ui.outstanding")}
                                    </h4>
                                    <div className="flex gap-1 items-center">
                                        <IconPlusEqual className="size-4 text-muted-soft" />
                                        <span className="text-sm">
                                            {summary.total_outstanding.toLocaleString()}
                                        </span>
                                        <span className="text-xs ps-1 text-muted">
                                            تومان
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <ProgressBar
                                label=""
                                value={
                                    summary.total_expenses !== 0
                                        ? ((summary.total_expenses -
                                              summary.total_outstanding) /
                                              summary.total_expenses) *
                                          100
                                        : 100
                                }
                            />
                            <div className="space-y-4 max-h-48 overflow-y-auto">
                                {summary.pending_balances?.map(
                                    (transaction, index) => (
                                        <BalanceCard
                                            key={index}
                                            transaction={transaction}
                                        />
                                    )
                                )}
                            </div>
                        </Card>
                        <Card>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <IconUsers className="w-12 h-12 p-3 rounded text-muted-fg bg-action" />
                                    <div className="flex flex-col justify-between">
                                        <h4 className="text-sm font-medium ">
                                            {t("members")}
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
                                        {t("ratio")}
                                    </h4>
                                    <div className="flex gap-1 items-center">
                                        {/* <span>مجموع هزینه ها:</span> */}
                                        <IconPercentage className="size-4 text-muted-soft" />
                                        <span className="text-sm">
                                            {summary.total_ratio.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <MembersStatusChart
                                membersCount={summary.members_count}
                                memberBalanceDistribution={
                                    memberBalanceDistribution
                                }
                            />
                            <div className="max-h-48 overflow-y-auto border border-border rounded">
                                {members.map((member) => (
                                    <div
                                        key={member.id}
                                        className="flex justify-between items-center relative px-4 py-4 last:border-none border-b border-border overflow-clip"
                                    >
                                        <span
                                            className={cn(
                                                "w-1 absolute inset-0 my-3 ms-1 rounded",
                                                (() => {
                                                    const st =
                                                        summary.net_balances.find(
                                                            (balance) =>
                                                                balance?.id ===
                                                                member?.id
                                                        )?.net || 0;

                                                    if (st === 0)
                                                        return "bg-action";

                                                    return st > 0
                                                        ? "bg-success"
                                                        : "bg-error";
                                                })()
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
                                            <span className="text-sm" dir="ltr">
                                                {summary.net_balances
                                                    .find(
                                                        (balance) =>
                                                            balance?.id ===
                                                            member?.id
                                                    )
                                                    ?.net.toLocaleString()}
                                            </span>
                                            <span className="text-xs ps-1 text-muted">
                                                تومان
                                            </span>
                                        </div>
                                        <span
                                            className={cn(
                                                "w-1 absolute end-0 top-0 bottom-0 my-3 me-1 rounded",
                                                (() => {
                                                    const st =
                                                        summary.net_balances.find(
                                                            (balance) =>
                                                                balance?.id ===
                                                                member?.id
                                                        )?.net || 0;

                                                    if (st === 0)
                                                        return "bg-action";

                                                    return st > 0
                                                        ? "bg-success"
                                                        : "bg-error";
                                                })()
                                            )}
                                        ></span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                        <Card className="md:col-span-2">
                            <div className="grid grid-cols-1 md:grid-cols-3">
                                <div className="md:pe-4 space-y-4 pb-8 md:pb-0">
                                    <div className="flex items-center gap-2 mb-4">
                                        <IconCash className="w-12 h-12 p-3 rounded text-muted-fg bg-action" />
                                        <h4 className="text-sm font-medium ">
                                            {t("ui.expenses")}
                                        </h4>
                                    </div>
                                    <Card className="flex-row items-center justify-between gap-2 px-4 py-2">
                                        <div className="flex items-center gap-2">
                                            <IconCash className="size-4" />
                                            <h4 className="text-sm font-medium ">
                                                {t("count")}
                                            </h4>
                                        </div>

                                        <span className="text-sm">
                                            {summary.expenses_count}
                                        </span>
                                    </Card>
                                    <Card className="flex-row items-center justify-between gap-2 px-4 py-2">
                                        <div className="flex items-center gap-2">
                                            <IconPlusEqual className="size-4" />
                                            <h4 className="text-sm font-medium ">
                                                {t("totalAmount")}
                                            </h4>
                                        </div>

                                        <div>
                                            <span className="text-sm">
                                                {summary.total_expenses.toLocaleString()}
                                            </span>
                                            <span className="text-xs ps-1 text-muted">
                                                تومان
                                            </span>
                                        </div>
                                    </Card>
                                    <Card className="flex-row items-center justify-between gap-2 px-4 py-2">
                                        <div className="flex items-center gap-2">
                                            <IconCongruentTo className="size-4" />
                                            <h4 className="text-sm font-medium ">
                                                {t("average")}{" "}
                                                <span className="">روزانه</span>
                                            </h4>
                                        </div>

                                        <div className="text-sm">
                                            {Math.round(
                                                summary.total_expenses /
                                                    summary.days_count
                                            ).toLocaleString()}
                                            <span className="text-xs ps-1 text-muted">
                                                تومان
                                            </span>
                                        </div>
                                    </Card>
                                </div>
                                <div className="col-span-2">
                                    <div className="flex w-full items-center justify-between">
                                        <div className="flex items-center">
                                            <IconChartArrowsVertical className="w-8 h-12 py-3.5" />
                                            <h4 className="text-sm font-medium ">
                                                {t("dailyExpenses")}
                                            </h4>
                                        </div>

                                        <ToggleButtonGroup
                                            buttons={[
                                                {
                                                    id: "area",
                                                    icon: (
                                                        <IconChartArea className="size-4" />
                                                    ),
                                                },
                                                {
                                                    id: "line",
                                                    icon: (
                                                        <IconChartLine className="size-4" />
                                                    ),
                                                },
                                                {
                                                    id: "bar",
                                                    icon: (
                                                        <IconChartBar className="size-4" />
                                                    ),
                                                },
                                            ]}
                                            value={chartType}
                                            onChange={(v) =>
                                                setChartType(
                                                    v as "area" | "line" | "bar"
                                                )
                                            }
                                        />
                                    </div>
                                    <DailyExpenseChart
                                        groupToken={token!}
                                        chartType={chartType}
                                        onChartTypeChange={setChartType}
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* activity */}
                    <Card className="col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-2">
                            <IconActivity className="w-12 h-12 p-3 rounded text-muted-fg bg-action" />
                            <div className="flex flex-col justify-between">
                                <h4 className="text-sm font-medium ">
                                    {t("recentActivity")}
                                </h4>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {summary.recent_activity?.map((activity) => (
                                <div key={activity.date} className="py-1">
                                    <div className="flex items-center">
                                        <IconTimelineEvent className="size-4 text-action" />
                                        <span className="text-xs ps-1">
                                            {formatDate(
                                                new Date(activity.date)
                                            )}
                                        </span>
                                    </div>
                                    <div className="space-y-2 p-2 ms-2 text-sm">
                                        {activity.expenses.map((expense) => (
                                            <div
                                                key={expense.id}
                                                className="flex items-center justify-between gap-1 border border-border rounded p-2"
                                            >
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-1">
                                                        <IconCash className="size-6 p-1 rounded-full bg-action text-action-fg" />
                                                        <div>
                                                            {expense.title}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {/* <Avatar
                                                            src={
                                                                expense.spender
                                                                    .avatar
                                                            }
                                                            alt={
                                                                expense.spender
                                                                    .name
                                                            }
                                                            size="sm"
                                                            className="rounded-full"
                                                        /> */}
                                                        <IconUser className="size-3 text-muted" />
                                                        <span className="text-xs">
                                                            {
                                                                expense.spender
                                                                    .name
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="h-6">
                                                        {expense.amount}
                                                        <span className="text-xs ps-1 text-muted">
                                                            تومان
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1 justify-end text-xs">
                                                        <IconPercentage className="size-3 text-muted" />
                                                        {expense.split}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {activity.repays.map((repay) => (
                                            <div className="flex items-center justify-between border border-border rounded p-2">
                                                <div className="flex items-center gap-2">
                                                    <IconTransfer className="size-6 p-1 rounded-full bg-action text-action-fg" />
                                                    <div className="flex items-center text-xs">
                                                        <IconUser className="size-3 text-muted" />
                                                        <span>
                                                            {repay.from.name}
                                                        </span>
                                                    </div>
                                                    {direction === "rtl" ? (
                                                        <IconArrowLeft className="size-3" />
                                                    ) : (
                                                        <IconArrowRight className="size-3" />
                                                    )}
                                                    <div className="flex items-center text-xs">
                                                        <IconUser className="size-3 text-muted" />
                                                        <span>
                                                            {repay.to.name}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    {repay.amount}
                                                    <span className="text-xs ps-1 text-muted">
                                                        تومان
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}
        </AsyncContent>
    );
}

export default Dashboard;
