import { getDailyExpenseTotals } from "@/api/endpoints/expenses";
import { useTranslations } from "@/hooks/useTranslations";
import { useQuery } from "@tanstack/react-query";
import { AsyncContent } from "@/components/common/AsyncContent";
import { motion } from "framer-motion";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Skeleton } from "../../common/Skeleton";

interface DailyExpenseChartProps {
    groupToken: string;
    chartType: "area" | "line" | "bar";
    onChartTypeChange: (type: "area" | "line" | "bar") => void;
}

function PersianDate(date: string) {
    return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(date));
}

export const DailyExpenseChart: React.FC<DailyExpenseChartProps> = ({
    groupToken,
    chartType,
    onChartTypeChange,
}) => {
    const { t } = useTranslations();

    const {
        data: dailyExpenses,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["dailyExpenses", groupToken],
        queryFn: () => getDailyExpenseTotals(groupToken),
        enabled: !!groupToken,
    });

    // const handleChartTypeChange = () => {
    //     // Cycle through chart types: bar -> area -> line -> bar
    //     const types: ("area" | "line" | "bar")[] = ["bar", "area", "line"];
    //     const currentIndex = types.indexOf(chartType);
    //     const nextIndex = (currentIndex + 1) % types.length;
    //     onChartTypeChange(types[nextIndex]);
    // };

    return (
        <AsyncContent
            isLoading={isLoading}
            error={error}
            loadingMessage={t("ui.loadingChart")}
            errorMessage={t("ui.errorFetchingData")}
            skeleton={<Skeleton className="w-full h-40" aria-hidden="true" />}
        >
            {dailyExpenses && dailyExpenses.data.length > 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    dir="ltr"
                    className="h-40 mt-2"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        {chartType === "area" ? (
                            <AreaChart
                                data={dailyExpenses.data}
                                margin={{
                                    top: 0,
                                    right: 5,
                                    left: 0,
                                    bottom: 0,
                                }}
                                aria-label={t("ui.dailyExpensesChart")}
                            >
                                <CartesianGrid
                                    strokeDasharray="2 6"
                                    className="stroke-action/30"
                                />
                                <XAxis
                                    className="[&_text]:fill-action/60 text-xs [&_line]:stroke-action-soft"
                                    dataKey="date"
                                    tickFormatter={(date) => PersianDate(date)}
                                    tickLine={false}
                                    interval="preserveStartEnd"
                                />
                                <YAxis
                                    className="[&_text]:fill-action/60 text-xs"
                                    allowDataOverflow
                                    type="number"
                                    axisLine={false}
                                    tickLine={false}
                                    interval="preserveStartEnd"
                                    // domain={[
                                    //     (minTotal) => minTotal * 0.9,
                                    //     (maxTotal) => maxTotal * 1.1,
                                    // ]}
                                    tickFormatter={(value) =>
                                        `${(value / 1000).toLocaleString()}`
                                    }
                                />
                                <Tooltip
                                    labelClassName="text-muted"
                                    wrapperClassName="text-xs rounded shadow border-border bg-surface"
                                    cursor={{
                                        opacity: 0.5,
                                    }}
                                    formatter={(value: number) => [
                                        `${value.toLocaleString()} تومان`,
                                        t("ui.total"),
                                    ]}
                                    labelFormatter={(date) => PersianDate(date)}
                                />
                                <defs>
                                    <linearGradient
                                        id="fillColor"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="var(--color-action)"
                                            stopOpacity={0.5}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="var(--color-action)"
                                            stopOpacity={1}
                                        />
                                    </linearGradient>
                                </defs>
                                <Area
                                    type="monotone"
                                    dataKey="total"
                                    stroke="var(--color-action)"
                                    strokeWidth={1.5}
                                    fillOpacity={1}
                                    fill="url(#fillColor)"
                                />
                            </AreaChart>
                        ) : chartType === "line" ? (
                            <LineChart
                                data={dailyExpenses.data}
                                margin={{
                                    top: 0,
                                    right: 5,
                                    left: 0,
                                    bottom: 0,
                                }}
                                aria-label={t("ui.dailyExpensesChart")}
                            >
                                <CartesianGrid
                                    strokeDasharray="2 6"
                                    className="stroke-action/30"
                                />
                                <XAxis
                                    className="[&_text]:fill-action/60 text-xs [&_line]:stroke-action-soft"
                                    dataKey="date"
                                    tickFormatter={(date) => PersianDate(date)}
                                    tickLine={false}
                                    interval="equidistantPreserveStart"
                                />
                                <YAxis
                                    className="[&_text]:fill-action/60 text-xs"
                                    allowDataOverflow
                                    interval="preserveStartEnd"
                                    type="number"
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) =>
                                        `${(value / 1000).toLocaleString()}`
                                    }
                                />
                                <Tooltip
                                    labelClassName="text-muted"
                                    wrapperClassName="text-xs rounded shadow border-border bg-surface"
                                    cursor={{
                                        opacity: 0.5,
                                    }}
                                    formatter={(value: number) => [
                                        `${value.toLocaleString()} تومان`,
                                        t("ui.total"),
                                    ]}
                                    labelFormatter={(date) => PersianDate(date)}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    stroke="var(--color-action)"
                                    strokeWidth={1}
                                />
                            </LineChart>
                        ) : (
                            <BarChart
                                data={dailyExpenses.data}
                                margin={{
                                    top: 0,
                                    right: 0,
                                    left: 0,
                                    bottom: 0,
                                }}
                                aria-label={t("ui.dailyExpensesChart")}
                            >
                                <CartesianGrid
                                    strokeDasharray="2 6"
                                    className="stroke-action/30"
                                />
                                <XAxis
                                    className="[&_text]:fill-action/60 text-xs [&_line]:stroke-action-soft"
                                    dataKey="date"
                                    tickFormatter={(date) => PersianDate(date)}
                                    tickLine={false}
                                />
                                <YAxis
                                    className="[&_text]:fill-action/60 text-xs"
                                    allowDataOverflow
                                    interval="preserveStartEnd"
                                    type="number"
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) =>
                                        `${(value / 1000).toLocaleString()}`
                                    }
                                />
                                <Tooltip
                                    labelClassName="text-muted"
                                    wrapperClassName="text-xs rounded shadow border-border bg-surface"
                                    cursor={{
                                        opacity: 0.5,
                                    }}
                                    formatter={(value: number) => [
                                        `${value.toLocaleString()} تومان`,
                                        t("ui.total"),
                                    ]}
                                    labelFormatter={(date) => PersianDate(date)}
                                />
                                <Bar
                                    dataKey="total"
                                    className="fill-action shadow"
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={20}
                                />
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </motion.div>
            ) : (
                <div className="flex items-center justify-center text-muted text-xs bg-muted-fg rounded h-40 w-full mt-2">
                    {t("ui.noExpenses")}
                </div>
            )}
        </AsyncContent>
    );
};
