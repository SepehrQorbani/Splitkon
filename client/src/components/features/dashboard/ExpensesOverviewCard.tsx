import {
    IconCash,
    IconPlusEqual,
    IconCongruentTo,
    IconChartArrowsVertical,
    IconChartArea,
    IconChartLine,
    IconChartBar,
} from "@tabler/icons-react";
import { Card } from "@/components/common/Card";
import Amount from "@/components/common/Amount";
import ToggleButtonGroup from "@/components/common/ToggleButtonGroup";
import { DailyExpenseChart } from "@/components/features/expenses/DailyExpenseChart";
import { useTranslations } from "@/hooks/useTranslations";
import { Summary } from "@/types/schemas/summary";
import { cn } from "@/utils/cn";
import { useState } from "react";

interface ExpensesOverviewCardProps {
    summary: Summary;
    groupToken: string;
    className?: string;
}

export function ExpensesOverviewCard({
    summary,
    groupToken,
    className,
}: ExpensesOverviewCardProps) {
    const { t } = useTranslations();
    const [chartType, setChartType] = useState<"area" | "line" | "bar">("area");

    return (
        <Card className={cn(className)}>
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
                            <Amount amount={summary.total_expenses} />
                        </div>
                    </Card>
                    <Card className="flex-row items-center justify-between gap-2 px-4 py-2">
                        <div className="flex items-center gap-2">
                            <IconCongruentTo className="size-4" />
                            <h4 className="text-sm font-medium ">
                                {t("dailyAverage")}
                            </h4>
                        </div>

                        <div className="text-sm">
                            <Amount
                                amount={Math.round(
                                    summary.total_expenses / summary.days_count
                                )}
                            />
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
                                    icon: <IconChartArea className="size-4" />,
                                },
                                {
                                    id: "line",
                                    icon: <IconChartLine className="size-4" />,
                                },
                                {
                                    id: "bar",
                                    icon: <IconChartBar className="size-4" />,
                                },
                            ]}
                            value={chartType}
                            onChange={(v) =>
                                setChartType(v as "area" | "line" | "bar")
                            }
                        />
                    </div>
                    <DailyExpenseChart
                        groupToken={groupToken}
                        chartType={chartType}
                        onChartTypeChange={setChartType}
                    />
                </div>
            </div>
        </Card>
    );
}
