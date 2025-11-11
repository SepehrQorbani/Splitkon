import Amount from "@/components/common/Amount";
import { useTranslations } from "@/hooks/useTranslations";
import { Member } from "@/types";
import { IconCash, IconCashRegister, IconTransfer } from "@tabler/icons-react";

type Props = { member: Member };

function MemberSummaryCard({ member }: Props) {
    const { t } = useTranslations();
    if (!member || !member?.status) return null;

    const items = [
        {
            label: member?.status.net
                ? `${t("attributes.amount")} ${t(member?.status?.title)}: `
                : t("ui.outstanding"),
            amount: member?.status.net,
            icon: <IconCashRegister className="size-4 text-muted" />,
        },
        {
            label: "مجموع هزینه ها:",
            amount: member?.total_expenses,
            icon: <IconCash className="size-4 text-muted" />,
        },
        {
            label: "مجموع پرداخت ها:",
            amount: member?.payment_balance,
            icon: <IconTransfer className="size-4 text-muted" />,
        },
    ];

    return (
        <div className="w-full px-2 bg-background rounded-md border border-border">
            {items.map((item, i) => (
                <div
                    key={i}
                    className="p-4 flex justify-between items-center border-t first:border-none border-border"
                >
                    <div className="flex items-center gap-1 shrink text-nowrap">
                        {item.icon}
                        <span className="text-xs text-muted">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        {item.amount ? (
                            <>
                                {/* <IconCurrencyDollar className="size-3.5 bg-muted text-muted-fg p-0.5 rounded-xs" /> */}
                                <Amount amount={item.amount ?? 0} />
                            </>
                        ) : (
                            <span className="text-muted-soft">-</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MemberSummaryCard;
