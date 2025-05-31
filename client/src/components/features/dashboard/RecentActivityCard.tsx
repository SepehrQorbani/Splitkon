import {
    IconActivity,
    IconTimelineEvent,
    IconCash,
    IconUser,
    IconPercentage,
    IconTransfer,
    IconArrowLeft,
    IconArrowRight,
    IconCashPlus,
    IconGlassFull,
} from "@tabler/icons-react";
import { Card } from "@/components/common/Card";
import Amount from "@/components/common/Amount";
import { useTranslations } from "@/hooks/useTranslations";
import { Summary } from "@/types/schemas/summary";
import { cn } from "@/utils/cn";

interface RecentActivityCardProps {
    summary: Summary;
    className?: string;
}

export function RecentActivityCard({
    summary,
    className,
}: RecentActivityCardProps) {
    const { t, formatDate, direction } = useTranslations();

    return (
        <Card className={cn("", className)}>
            <div className="flex items-center gap-2">
                <IconActivity className="w-12 h-12 p-3 rounded text-muted-fg bg-action" />
                <div className="flex flex-col justify-between">
                    <h4 className="text-sm font-medium ">
                        {t("recentActivity")}
                    </h4>
                </div>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto h-full">
                {summary.recent_activity?.length > 0 ? (
                    summary.recent_activity?.map((activity) => (
                        <div key={activity.date} className="py-1">
                            <div className="flex items-center">
                                <IconTimelineEvent className="size-4 text-action" />
                                <span className="text-xs ps-1">
                                    {formatDate(new Date(activity.date))}
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
                                                <div>{expense.title}</div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <IconUser className="size-3 text-muted" />
                                                <span className="text-xs">
                                                    {expense.spender.name}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-6">
                                                <Amount
                                                    amount={expense.amount}
                                                />
                                            </div>
                                            <div className="flex items-center gap-1 justify-end text-xs">
                                                <IconPercentage className="size-3 text-muted" />
                                                {expense.split}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {activity.repays.map((repay) => (
                                    <div
                                        key={repay.id}
                                        className="flex items-center justify-between border border-border rounded p-2"
                                    >
                                        <div className="flex items-center gap-2">
                                            <IconTransfer className="size-6 p-1 rounded-full bg-action text-action-fg" />
                                            <div className="flex items-center text-xs">
                                                <IconUser className="size-3 text-muted" />
                                                <span>{repay.from.name}</span>
                                            </div>
                                            {direction === "rtl" ? (
                                                <IconArrowLeft className="size-3" />
                                            ) : (
                                                <IconArrowRight className="size-3" />
                                            )}
                                            <div className="flex items-center text-xs">
                                                <IconUser className="size-3 text-muted" />
                                                <span>{repay.to.name}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <Amount amount={repay.amount} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center gap-4 text-muted-soft text-xs bg-linear-0 from-muted-fg\0 to-muted-fg rounded h-full w-full p-4">
                        <div className="space-y-1">
                            <div className="bg-surface border border-border rounded-lg flex flex-col justify-between p-1.5">
                                <div className="flex items-center justify-between px-1 gap-1">
                                    <IconCashPlus className="size-4" />
                                    <IconUser className="size-4 p-0.5 bg-action-faint border border-border rounded" />
                                    <span className="bg-action-subtle h-1 w-8 rounded ms-auto "></span>
                                    <IconGlassFull className="size-4 p-0.5 bg-action-faint border border-border rounded" />
                                </div>
                            </div>
                            <div className="bg-surface border border-border rounded-lg flex flex-col justify-between p-1.5">
                                <div className="flex items-center justify-between px-1 gap-1">
                                    <IconTransfer className="size-4 me-1" />
                                    <IconUser className="size-4 p-0.5 bg-action-faint border border-border rounded-full" />
                                    <IconArrowLeft className="size-3 text-action-soft" />
                                    <IconUser className="size-4 p-0.5 bg-action-faint border border-border rounded-full me-4" />
                                    <span className="bg-action-subtle h-1 w-8 rounded me-auto"></span>
                                </div>
                            </div>
                        </div>
                        {t("ui.noActivity")}
                    </div>
                )}
            </div>
        </Card>
    );
}
