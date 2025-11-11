import Amount from "@/components/common/Amount";
import Avatar from "@/components/common/Avatar";
import { useTranslations } from "@/hooks/useTranslations";
import { useBalanceStore, useMemberStore } from "@/store";
import { Member } from "@/types";
import { IconChecks, IconTransfer } from "@tabler/icons-react";

type Props = { member: Member };

function MemberPendingBalancesCard({ member }: Props) {
    const { t } = useTranslations();
    const balance = useBalanceStore((state) => state.balance);
    const getMember = useMemberStore((state) => state.getMember);

    const memberBalance = (member && balance?.[member?.id]) || [];
    return (
        <div className="w-full px-2 bg-background rounded-md border border-border">
            <div className="text-xs font-bold ps-1 py-2 border-b border-border flex items-center gap-1">
                <IconTransfer className="size-3" />

                {t("ui.accountBalances")}
            </div>
            {memberBalance.length === 0 ? (
                <div className="flex items-center gap-1 text-[10px] text-muted p-4">
                    <IconChecks className="size-3.5" />
                    <div className="shrink-0">{t("ui.settled")}</div>
                </div>
            ) : (
                memberBalance?.map((transaction, index) => {
                    const to = getMember(transaction.to);
                    return (
                        <div
                            key={index}
                            className="p-4 flex justify-between items-center border-t first:border-none border-border"
                        >
                            <div className="text-xs text-muted flex items-center gap-1">
                                <span className="text-[10px]">
                                    {transaction.amount > 0
                                        ? t("ui.toMember")
                                        : t("fromMember")}
                                    {": "}
                                </span>
                                <Avatar src={to?.avatar} size="xs" />
                                {to?.name}
                            </div>
                            <div className="flex items-center gap-1">
                                <Amount amount={Math.abs(transaction.amount)} />
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}

export default MemberPendingBalancesCard;
