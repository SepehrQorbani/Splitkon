import Amount from "@/components/common/Amount";
import Avatar from "@/components/common/Avatar";
import { Drawer } from "@/components/common/Drawer";
import { RepaysForm } from "@/components/features/repays/RepayForm";
import { usePermissions } from "@/hooks/usePermissions";
import { useTranslations } from "@/hooks/useTranslations";
import { useMemberStore } from "@/store/members";
import { BalanceTransaction } from "@/types/schemas/balance";
import { Member } from "@/types/schemas/members";
import { PendingBalance } from "@/types/schemas/summary";
import {
    IconArrowLeft,
    IconArrowRight,
    IconTransfer,
} from "@tabler/icons-react";

type BalanceCardProps = {
    transaction: BalanceTransaction | PendingBalance;
    member?: Member;
};

function BalanceCard({ transaction, member }: BalanceCardProps) {
    const { can } = usePermissions();
    const { direction, t } = useTranslations();
    const getMember = useMemberStore((state) => state.getMember);
    let fromMember = member;
    if (!member && "from" in transaction && transaction.from) {
        fromMember = getMember(transaction.from);
    }
    const toMember = getMember(transaction.to);

    return (
        toMember && (
            <div className="flex items-center justify-between gap-2 py-4 px-2 text-xs rounded bg-muted/10 border border-border">
                <div className="flex items-center gap-2">
                    {!member && fromMember ? (
                        <>
                            <Avatar
                                size="sm"
                                src={fromMember.avatar}
                                alt={fromMember.name}
                            />
                            <span>{fromMember.name}</span>
                            {direction === "rtl" ? (
                                <IconArrowLeft className="size-3" />
                            ) : (
                                <IconArrowRight className="size-3" />
                            )}
                        </>
                    ) : (
                        <span className="text-muted">
                            {transaction.amount > 0 ? t("to") : t("from")}
                        </span>
                    )}
                    <Avatar
                        size="sm"
                        src={toMember.avatar}
                        alt={toMember.name}
                    />
                    <span>{toMember.name}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div>
                        <Amount amount={Math.abs(transaction.amount)} />
                    </div>
                    {can("addRepays") && (
                        <Drawer
                            triggerLabel={<IconTransfer className="size-4" />}
                            title={t("repay")}
                            children={({ close }) => (
                                <RepaysForm
                                    defaultValue={{
                                        from_id:
                                            transaction.amount < 0
                                                ? transaction.to
                                                : fromMember?.id,
                                        to_id:
                                            transaction.amount < 0
                                                ? fromMember?.id
                                                : transaction.to,
                                        amount: Math.abs(transaction.amount),
                                    }}
                                    onSubmitSuccess={(data) => {
                                        console.log(data);
                                        close();
                                    }}
                                />
                            )}
                            buttonProps={{
                                intent: "neutral",
                                className: "h-6 w-6 p-1",
                            }}
                        />
                    )}
                </div>
            </div>
        )
    );
}

export default BalanceCard;
