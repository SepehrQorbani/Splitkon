import { Card } from "@/components/common/Card";
import ToggleButtonGroup from "@/components/common/ToggleButtonGroup";
import { DailyExpenseChart } from "@/components/features/expenses/DailyExpenseChart";
import { useTranslations } from "@/hooks/useTranslations";
import { Summary } from "@/types/schemas/summary";
import { cn } from "@/utils/cn";
import {
    IconChartArea,
    IconChartBar,
    IconChartHistogram,
    IconChartLine,
} from "@tabler/icons-react";
import { useState } from "react";

interface ExpensesOverviewCardProps {
    summary: Summary;
    groupToken: string;
    className?: string;
}

export function ExpensesOverviewCard({
    groupToken,
    className,
}: ExpensesOverviewCardProps) {
    const { t } = useTranslations();
    const [chartType, setChartType] = useState<"area" | "line" | "bar">("bar");

    return (
        <Card className={cn("p-1 justify-between", className)}>
            <div className="flex w-full items-center justify-between p-2">
                <div className="flex items-center gap-2">
                    <IconChartHistogram className="w-12 h-12 p-3 rounded text-muted-fg bg-action" />
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
                    onChange={(v) => setChartType(v as "area" | "line" | "bar")}
                />
            </div>
            <DailyExpenseChart
                groupToken={groupToken}
                chartType={chartType}
                onChartTypeChange={setChartType}
            />
        </Card>
    );
}
