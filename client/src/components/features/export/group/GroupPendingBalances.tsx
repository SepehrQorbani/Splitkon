import Amount from "@/components/common/Amount";
import { useTranslations } from "@/hooks/useTranslations";
import { useMemberStore } from "@/store";
import { Summary } from "@/types/schemas/summary";
import { IconArrowLeftDashed } from "@tabler/icons-react";

export const GroupPendingBalances = ({
    summary,
}: {
    summary: Summary | null;
}) => {
    const { t } = useTranslations();
    const getMember = useMemberStore((state) => state.getMember);
    // if (!summary?.pending_balances || summary?.pending_balances.length === 0)
    //     return null;

    return (
        <div className="px-4 text-xs my-6 py-4 mx-2">
            <div className="font-bold mb-2">{t("ui.accountBalances")}</div>
            {summary?.pending_balances &&
            summary?.pending_balances.length > 0 ? (
                summary?.pending_balances.map((transaction, index) => {
                    const fromMember = getMember(transaction.from);

                    const toMember = getMember(transaction.to);
                    return (
                        <div
                            key={index}
                            className="relative flex flex-nowrap text-nowrap items-center gap-2 py-2 px-2"
                        >
                            <div className="shrink-0 text-xs">
                                <div className="flex items-center gap-1">
                                    {index + 1 + ".  "}
                                    {fromMember?.name}
                                    <IconArrowLeftDashed className="size-4 p-0.5" />
                                    {toMember?.name}
                                </div>
                            </div>
                            <div className="w-full min-w-4 border-b border-dashed border-border"></div>
                            <div className="shrink-0 text-sm">
                                <div className="flex items-center justify-end">
                                    <Amount
                                        // showUnit={false}
                                        amount={transaction.amount}
                                    />
                                    {/* <IconCurrencyDollar className="size-3" /> */}
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="flex items-center gap-1 text-[10px] text-muted">
                    <div className="w-full min-w-4 border-b border-dashed border-border"></div>
                    <div className="shrink-0">{t("ui.settled")}</div>
                    <div className="w-full min-w-4 border-b border-dashed border-border"></div>
                </div>
            )}
        </div>
    );
};
