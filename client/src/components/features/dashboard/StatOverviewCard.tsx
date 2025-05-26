import Amount from "@/components/common/Amount";
import { Card } from "@/components/common/Card";
import { useTranslations } from "@/hooks/useTranslations";
import { Summary } from "@/types/schemas/summary";
import {
    IconCash,
    IconCashRegister,
    IconCongruentTo,
    IconHash,
    IconPlusEqual,
    IconReport,
    IconTransfer,
} from "@tabler/icons-react";
import { FC, JSX } from "react";

type StatOverviewCardProps = {
    summary: Summary;
    className?: string;
};

function StatOverviewCard({ summary }: StatOverviewCardProps) {
    const { t } = useTranslations();

    return (
        <Card className="gap-0">
            <div className="flex items-center gap-2">
                <IconReport className="w-12 h-12 p-3 rounded text-muted-fg bg-action" />
                <h4 className="text-sm font-medium ">{t("statistics")}</h4>
            </div>
            <div className="max-h-48 px-1 overflow-y-auto">
                <StatSection title={t("ui.expenses")} icon={IconCash}>
                    <StatRow
                        icon={IconHash}
                        label={t("ui.totalCount")}
                        value={summary.expenses_count}
                    />
                    <StatRow
                        icon={IconPlusEqual}
                        label={t("totalAmount")}
                        value={<Amount amount={summary.total_expenses} />}
                    />
                    <StatRow
                        icon={IconCongruentTo}
                        label={t("dailyAverage")}
                        value={
                            <Amount
                                amount={Math.round(
                                    summary.total_expenses / summary.days_count
                                )}
                            />
                        }
                    />
                </StatSection>
                <StatSection title={t("ui.repays")} icon={IconTransfer}>
                    <StatRow
                        icon={IconHash}
                        label={t("ui.totalCount")}
                        value={summary.repays_count}
                    />
                    <StatRow
                        icon={IconPlusEqual}
                        label={t("totalAmount")}
                        value={<Amount amount={summary.total_repays} />}
                    />
                    <StatRow
                        icon={IconCashRegister}
                        label={t("outstanding")}
                        value={<Amount amount={summary.total_outstanding} />}
                    />
                </StatSection>
            </div>
        </Card>
    );
}

export default StatOverviewCard;

interface StatRowProps {
    icon: FC<{ className?: string }>;
    label: string;
    value: string | number | JSX.Element;
}

interface StatSectionProps {
    title: string;
    icon: FC<{ className?: string }>;
    children: React.ReactNode;
}

const StatRow: FC<StatRowProps> = ({ icon: Icon, label, value }) => (
    // <div className="relative flex flex-nowrap text-nowrap items-center gap-2 my-3 py-1 px-2 border border-border rounded bg-surface">
    <div className="relative flex flex-nowrap text-nowrap items-center gap-2 py-2">
        {/* <div className="shrink-0 py-1 px-2 border border-border rounded bg-surface flex items-center">
            <Icon className="size-3" />
            <div className="text-xs">{label}</div>
        </div> */}
        <Icon className="shrink-0 size-6 shadow p-1 border border-border rounded bg-surface" />
        {/* <Icon className="size-6 p-1" /> */}

        <div className="shrink-0 text-xs">{label}</div>
        <div className="w-full border-b border-dashed border-border" />
        <div className="shrink-0 text-sm">{value}</div>
    </div>
);

const StatSection: FC<StatSectionProps> = ({ title, icon: Icon, children }) => (
    <div className="relative pt-2 pe-2">
        <div className="absolute inset-0 border-s border-border ms-3 my-4" />
        <div className="relative flex flex-nowrap text-nowrap items-center gap-2 py-2">
            <Icon className="shrink-0 size-8 -ms-0.5 shadow border border-border rounded p-1.5 bg-surface" />
            {/* <div className="shrink-0 -ms-1.5 shadow border border-border rounded p-1 bg-surface">
                <Icon className="size-7 border border-border rounded p-1 bg-surface" />
            </div> */}
            <h4 className="shrink-0 text-sm font-medium">{title}</h4>
            {/* <div className="w-full border-b border-dashed border-border" /> */}
        </div>
        {children}
    </div>
);
