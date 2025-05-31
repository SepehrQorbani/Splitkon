import { useGetDailyExpenseTotals } from "@/api/queries/expenses";
import Amount from "@/components/common/Amount";
import AsyncContent from "@/components/common/AsyncContent";
import { useTranslations } from "@/hooks/useTranslations";
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
    TooltipProps,
    XAxis,
} from "recharts";
import {
    NameType,
    ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { Skeleton } from "../../common/Skeleton";

interface DailyExpenseChartProps {
    groupToken: string;
    chartType: "area" | "line" | "bar";
    onChartTypeChange: (type: "area" | "line" | "bar") => void;
}

export const DailyExpenseChart: React.FC<DailyExpenseChartProps> = ({
    groupToken,
    chartType,
}) => {
    const { t, formatDate } = useTranslations();

    const {
        data: dailyExpenses,
        isLoading,
        error,
        refetch,
    } = useGetDailyExpenseTotals(groupToken);

    return (
        <AsyncContent
            isLoading={isLoading}
            error={error}
            refetch={refetch}
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
                                    tickFormatter={(date) => formatDate(date)}
                                    tickLine={false}
                                    interval="preserveStartEnd"
                                />
                                {/* <YAxis
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
                                /> */}
                                <Tooltip content={<ChartTooltip />} />
                                <defs>
                                    <linearGradient
                                        id="fillColor"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="10%"
                                            stopColor="var(--color-action)"
                                            stopOpacity={0.7}
                                        />
                                        <stop
                                            offset="100%"
                                            stopColor="var(--color-action)"
                                            stopOpacity={0}
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
                                    tickFormatter={(date) => formatDate(date)}
                                    tickLine={false}
                                    interval="equidistantPreserveStart"
                                />
                                {/* <YAxis
                                    className="[&_text]:fill-action/60 text-xs"
                                    allowDataOverflow
                                    interval="preserveStartEnd"
                                    type="number"
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) =>
                                        `${(value / 1000).toLocaleString()}`
                                    }
                                /> */}
                                <Tooltip content={<ChartTooltip />} />
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
                                    tickFormatter={(date) => formatDate(date)}
                                    tickLine={false}
                                />
                                {/* <YAxis
                                    className="[&_text]:fill-action/60 text-xs"
                                    allowDataOverflow
                                    interval="preserveStartEnd"
                                    type="number"
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) =>
                                        `${(value / 1000).toLocaleString()}`
                                    }
                                /> */}
                                <Tooltip content={<ChartTooltip />} />
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
                <div className="flex flex-col gap-4 items-center justify-center text-muted-soft text-xs rounded h-40 w-full bg-linear-0 from-muted-fg\0 to-muted-fg">
                    <div className="flex gap-2 items-end relative p-2 pb-1 bg-surface border border-border rounded-lg">
                        {/* <span className="absolute inset-0 bg-linear-0 from-surface\0 to-surface rounded-full aspect-square -z-10"></span> */}
                        <span className="w-2 bg-muted-subtle h-4 rounded-xs"></span>
                        <span className="w-2 bg-muted-subtle h-2 rounded-xs"></span>
                        <span className="w-2 bg-muted-subtle h-8 rounded-xs"></span>
                        <span className="w-2 bg-muted-subtle h-6 rounded-xs"></span>
                        <span className="w-2 bg-muted-subtle h-4 rounded-xs"></span>
                        <span className="w-2 bg-muted-subtle h-8 rounded-xs"></span>
                        <span className="w-2 bg-muted-subtle h-2 rounded-xs"></span>
                    </div>
                    <p className="text-muted-soft text-center">
                        {t("ui.noExpenses")}
                    </p>
                </div>
            )}
        </AsyncContent>
    );
};

const ChartTooltip = ({
    active,
    payload,
    label,
}: TooltipProps<ValueType, NameType>) => {
    const { direction, formatDate } = useTranslations();
    if (active && payload && payload.length && payload[0].value) {
        return (
            <div
                className="text-xs rounded shadow border-border bg-surface p-2 space-y-2"
                dir={direction}
            >
                <div className="text-muted">{formatDate(label)}</div>
                <div>
                    <Amount amount={+payload[0].value} />
                </div>
            </div>
        );
    }

    return null;
};
