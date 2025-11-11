import Amount from "@/components/common/Amount";
import Avatar from "@/components/common/Avatar";
import { useTranslations } from "@/hooks/useTranslations";
import { useMemberStore } from "@/store";
import { Summary } from "@/types/schemas/summary";
import {
    IconArrowLeftDashed,
    IconChecks,
    IconCurrencyDollar,
    IconTransfer,
} from "@tabler/icons-react";

export const GroupPendingBalancesCard = ({
    summary,
}: {
    summary: Summary | null;
}) => {
    const { t } = useTranslations();
    const getMember = useMemberStore((state) => state.getMember);

    return (
        <div className="w-full px-2 bg-background rounded-md border border-border">
            <div className="text-xs font-bold ps-1 py-2 border-b border-border flex items-center gap-1">
                <IconTransfer className="size-3" />

                {t("ui.outstanding")}
            </div>
            {summary?.pending_balances &&
            summary?.pending_balances.length > 0 ? (
                summary.pending_balances.map((tx, i) => {
                    const from = getMember(tx.from);
                    const to = getMember(tx.to);
                    return (
                        <div
                            key={i}
                            className="p-4 flex justify-between items-center border-t first:border-none border-border"
                        >
                            <div className="text-xs text-muted flex items-center gap-1">
                                <Avatar src={from?.avatar} size="xs" />
                                {from?.name}
                                <IconArrowLeftDashed className="size-3 mx-2" />
                                <Avatar src={to?.avatar} size="xs" />
                                {to?.name}
                            </div>
                            <div className="flex items-center gap-1">
                                <IconCurrencyDollar className="size-3" />
                                <Amount showUnit={false} amount={tx.amount} />
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="flex items-center gap-1 text-[10px] text-muted p-4">
                    <IconChecks className="size-3.5" />
                    <div className="shrink-0">{t("ui.settled")}</div>
                </div>
            )}
        </div>
    );
};
