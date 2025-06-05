import { useTranslations } from "@/hooks/useTranslations";

interface MembersStatusChartProps {
    membersCount: number;
    memberBalanceDistribution: {
        balanced: number;
        debtors: number;
        creditors: number;
    };
}

export default function MembersStatusChart({
    membersCount,
    memberBalanceDistribution,
}: MembersStatusChartProps) {
    const { t } = useTranslations();
    const totalMembers = membersCount || 1;
    const balanced = memberBalanceDistribution?.balanced || 0;
    const debtors = memberBalanceDistribution?.debtors || 0;
    const creditors = memberBalanceDistribution?.creditors || 0;

    const balancedPercent = (balanced / totalMembers) * 100;
    const debtorsPercent = (debtors / totalMembers) * 100;
    const creditorsPercent = (creditors / totalMembers) * 100;
    return (
        <div className="pe-2">
            <div className="flex justify-between mt-1 text-[10px]">
                <div className="flex items-center gap-1">
                    <span
                        className={`size-2 rounded-full bg-settled-subtle border border-settled`}
                    />
                    {t("statusSettled")}: {balanced.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                    <span
                        className={`size-2 rounded-full bg-debtor-subtle border border-debtor`}
                    />
                    {t("statusDebtor")}: {debtors.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                    <span
                        className={`size-2 rounded-full bg-creditor-subtle border border-creditor`}
                    />
                    {t("statusCreditor")}: {creditors.toLocaleString()}
                </div>
            </div>
            <div className="flex w-full h-1.5 box-content p-1 rounded-full border border-border gap-1">
                {balancedPercent > 0 && (
                    <div
                        className="flex items-center justify-center bg-settled-subtle border border-settled text-xs text-white rounded-full"
                        style={{ width: `${balancedPercent}%` }}
                        title={t("statusSettled")}
                    />
                )}
                {debtorsPercent > 0 && (
                    <div
                        className="flex items-center justify-center bg-debtor-subtle border border-debtor text-xs text-white rounded-full"
                        style={{ width: `${debtorsPercent}%` }}
                        title={t("statusDebtor")}
                    />
                )}
                {creditorsPercent > 0 && (
                    <div
                        className="flex items-center justify-center bg-creditor-subtle border border-creditor text-xs text-white rounded-full"
                        style={{
                            width: `${creditorsPercent}%`,
                        }}
                        title={t("statusCreditor")}
                    />
                )}
            </div>
        </div>
    );
}
