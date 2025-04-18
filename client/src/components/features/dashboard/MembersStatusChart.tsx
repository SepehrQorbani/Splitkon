import { useTranslations } from "@/hooks/useTranslations";
import {
    IconCreditCard,
    IconCreditCardPay,
    IconCreditCardRefund,
} from "@tabler/icons-react";

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
                    <IconCreditCard className="size-3 text-action" />
                    {t("بی حساب")}: {balanced.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                    <IconCreditCardPay className="size-3 text-error" />
                    {t("بدهکار")}: {debtors.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                    <IconCreditCardRefund className="size-3 text-success" />
                    {t("طلبکار")}: {creditors.toLocaleString()}
                </div>
            </div>
            <div className="flex w-full h-1.5 box-content p-1 rounded-full border border-border gap-1">
                {balancedPercent > 0 && (
                    <div
                        className="flex items-center justify-center bg-action/40 border border-action text-xs text-white rounded-full"
                        style={{ width: `${balancedPercent}%` }}
                        title={t("بی حساب")}
                    />
                )}
                {debtorsPercent > 0 && (
                    <div
                        className="flex items-center justify-center bg-error/40 border border-error text-xs text-white rounded-full"
                        style={{ width: `${debtorsPercent}%` }}
                        title={t("بدهکار")}
                    />
                )}
                {creditorsPercent > 0 && (
                    <div
                        className="flex items-center justify-center bg-success/40 border border-success text-xs text-white rounded-full"
                        style={{
                            width: `${creditorsPercent}%`,
                        }}
                        title={t("طلبکار")}
                    />
                )}
            </div>
        </div>
    );
}
