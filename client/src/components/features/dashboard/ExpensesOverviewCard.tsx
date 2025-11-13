import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import ToggleButtonGroup from "@/components/common/ToggleButtonGroup";
import { DailyExpenseChart } from "@/components/features/expenses/DailyExpenseChart";
import { useDomCapture } from "@/hooks/useDomCapture";
import { useTranslations } from "@/hooks/useTranslations";
import { Summary } from "@/types/schemas/summary";
import { cn } from "@/utils/cn";
import { expandScrollPlugin } from "@/utils/expandScrollPlugin";
import { logoOverlayPlugin } from "@/utils/logoOverlayPlugin";
import {
    IconChartArea,
    IconChartBar,
    IconChartHistogram,
    IconChartLine,
    IconPhotoDown,
} from "@tabler/icons-react";
import { snapdom } from "@zumer/snapdom";
import { useRef, useState } from "react";

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
    const { targetRef, capture } = useDomCapture({
        filename: "splitkon-chart",
        withLogo: true,
        logoOptions: { height: 12, opacity: 0.85, margin: 10 },
    });

    return (
        <Card className={cn("p-1 justify-between", className)}>
            <div className="flex w-full items-center justify-between p-2">
                <div className="flex items-center gap-2">
                    <IconChartHistogram className="w-12 h-12 p-3 rounded text-muted-fg bg-action" />
                    <h4 className="text-sm font-medium ">
                        {t("dailyExpenses")}
                    </h4>
                    <Button
                        variant="ghost"
                        size="icon"
                        onPress={() => {
                            capture();
                        }}
                        className="p-1"
                    >
                        <IconPhotoDown className="size-4" />
                    </Button>
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
                ref={targetRef}
                groupToken={groupToken}
                chartType={chartType}
                onChartTypeChange={setChartType}
            />
        </Card>
    );
}
