import Amount from "@/components/common/Amount";
import { Card } from "@/components/common/Card";
import CopyButton from "@/components/common/CopyButton";
import ProgressBar from "@/components/common/ProgressBar";
import BalanceCard from "@/components/features/balance/BalanceCard";
import { useReportGenerator } from "@/hooks/useReportGenerator";
import { useTranslations } from "@/hooks/useTranslations";
import { Summary } from "@/types/schemas/summary";
import { cn } from "@/utils/cn";
import {
    IconArrowLeft,
    IconMathSymbols,
    IconPlusEqual,
    IconTransfer,
    IconUser,
} from "@tabler/icons-react";
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
                        <h4 className="text-sm font-medium space-x-1 flex items-center">
                            <span>{t("ui.groupStatus")}</span>
                            <CopyButton data={generateGroupReport(summary)} />
                        </h4>
                        <div>
                            <span className="text-sm">
                                {summary.total_outstanding === 0
                                    ? t("ui.settled")
                                    : t("ui.unSettled")}
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

            {summary.pending_balances?.length ? (
                <>
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
                        color="settled"
                    />
                    <div className="space-y-4 max-h-48 overflow-y-auto">
                        {summary.pending_balances.map((transaction, index) => (
                            <BalanceCard
                                key={index}
                                transaction={transaction}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center gap-4 text-muted-soft text-xs bg-linear-0 from-muted-fg\0 to-muted-fg rounded h-full w-full p-4">
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
            )}
        </Card>
    );
};
