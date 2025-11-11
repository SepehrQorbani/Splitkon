import Amount from "@/components/common/Amount";
import { useTranslations } from "@/hooks/useTranslations";
import { Member } from "@/types";
import { IconCash, IconCashRegister, IconTransfer } from "@tabler/icons-react";

type Props = { member: Member };

function MemberSummary({ member }: Props) {
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
        <div className="px-4 text-xs">
            <table className="w-full border-collapse">
                <tbody className="w-full border-collapse">
                    {items.map((item, i) => (
                        <tr
                            key={i}
                            className="border-b border-dashed border-border last:border-none"
                        >
                            <td className="ps-4 py-4 text-muted">
                                {item.label}
                            </td>
                            <td className="text-end">
                                <div className="flex items-center justify-end pe-4">
                                    {item.amount ? (
                                        <>
                                            {/* <IconCurrencyDollar className="size-3.5 bg-muted text-muted-fg p-0.5 rounded-xs" /> */}
                                            <Amount amount={item.amount ?? 0} />
                                        </>
                                    ) : (
                                        <span className="text-muted-soft">
                                            -
                                        </span>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MemberSummary;
