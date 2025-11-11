import Amount from "@/components/common/Amount";
import { useTranslations } from "@/hooks/useTranslations";
import { useBalanceStore, useMemberStore } from "@/store";
import { Member } from "@/types";
import { IconArrowLeftDashed } from "@tabler/icons-react";

type Props = { member: Member };

function MemberPendingBalances({ member }: Props) {
    const { t } = useTranslations();
    const balance = useBalanceStore((state) => state.balance);
    const getMember = useMemberStore((state) => state.getMember);

    const memberBalance = (member && balance?.[member?.id]) || [];
    // if (memberBalance.length === 0) return null;
    return (
        <div className="px-4 text-xs my-6 py-4 mx-2">
            <div className="font-bold mb-2">{t("ui.accountBalances")}</div>
            {memberBalance.length === 0 ? (
                <div className="flex items-center gap-1 text-[10px] text-muted">
                    <div className="w-full min-w-4 border-b border-dashed border-border"></div>
                    <div className="shrink-0">{t("ui.settled")}</div>
                    <div className="w-full min-w-4 border-b border-dashed border-border"></div>
                </div>
            ) : (
                <div className="w-full border-collapse">
                    {memberBalance.length > 0 &&
                        memberBalance?.map((transaction, index) => (
                            <div
                                key={index}
                                className="relative flex flex-nowrap text-nowrap items-center gap-2 py-2 px-2"
                            >
                                <div className="shrink-0 text-xs">
                                    <div className="flex items-center gap-1">
                                        {index + 1 + ".  "}
                                        <span className="text-[10px]">
                                            {transaction.amount > 0
                                                ? t("ui.toMember")
                                                : t("fromMember")}
                                            {": "}
                                        </span>
                                        <IconArrowLeftDashed className="size-4 p-0.5" />
                                        <span>
                                            {getMember(transaction.to)?.name}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full min-w-4 border-b border-dashed border-border"></div>
                                <div className="shrink-0 text-sm">
                                    <div className="flex items-center justify-end">
                                        <Amount amount={transaction.amount} />
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}

export default MemberPendingBalances;
