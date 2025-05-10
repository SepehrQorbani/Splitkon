import { Card } from "@/components/common/Card";
import CopyButton from "@/components/common/CopyButton";
import ProgressBar from "@/components/common/ProgressBar";
import Amount from "@/components/common/Amount";
import BalanceCard from "@/components/features/balance/BalanceCard";
import {
    IconAbacus,
    IconMathSymbols,
    IconPlusEqual,
} from "@tabler/icons-react";
import { Summary } from "@/types/schemas/summary";
import { cn } from "@/utils/cn";
import { useReportGenerator } from "@/hooks/useReportGenerator";
import { useTranslations } from "@/hooks/useTranslations";
import { FC } from "react";

interface OutstandingStatusCardProps {
    summary: Summary;
    className?: string;
}

export const OutstandingStatusCard: FC<OutstandingStatusCardProps> = ({
    summary,
    className,
}) => {
    const { t } = useTranslations();
    const { generateGroupReport } = useReportGenerator();
    return (
        <Card className={cn(className)}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <IconMathSymbols className="w-12 h-12 p-3 rounded text-muted-fg bg-action" />
                    <div className="flex flex-col justify-between">
                        <h4 className="text-sm font-medium space-x-1">
                            <span>{t("groupStatus")}</span>
                            <CopyButton data={generateGroupReport(summary)} />
                        </h4>
                        <div>
                            <span className="text-sm">
                                {summary.total_outstanding === 0
                                    ? t("settled")
                                    : t("unSettled")}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-between">
                    <h4 className="text-sm font-medium ">
                        {t("ui.outstanding")}
                    </h4>
                    <div className="flex gap-1 items-center">
                        <IconPlusEqual className="size-4 text-muted-soft" />
                        <Amount amount={summary.total_outstanding} />
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
                {summary.pending_balances?.map((transaction, index) => (
                    <BalanceCard key={index} transaction={transaction} />
                ))}
            </div>
        </Card>
    );
};
