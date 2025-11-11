import Amount from "@/components/common/Amount";
import { useTranslations } from "@/hooks/useTranslations";
import { Summary } from "@/types/schemas/summary";
import { IconCash, IconCashRegister, IconTransfer } from "@tabler/icons-react";

export const GroupSummaryCard = ({ summary }: { summary: Summary | null }) => {
    const { t } = useTranslations();
    if (!summary) return null;

    const items = [
        {
            label: `${t("ui.expenses")} (${t("ui.total")}: ${
                summary.expenses_count
            })`,
            icon: <IconCash className="size-4" />,
            amount: summary.total_expenses,
        },
        {
            label: `${t("ui.repays")} (${t("ui.total")}: ${
                summary.repays_count
            })`,
            icon: <IconTransfer className="size-4" />,
            amount: summary.total_repays,
        },
        {
            label: t("ui.outstanding"),
            icon: <IconCashRegister className="size-4" />,
            amount: summary.total_outstanding,
        },
    ];

    return (
        <div className="w-full px-2 bg-background rounded-md border border-border">
            {items.map((item, i) => (
                <div
                    key={i}
                    className="py-4 px-2 flex justify-between items-center border-t first:border-none border-border"
                >
                    <div className="flex items-center gap-1 shrink text-nowrap text-muted">
                        {item.icon}
                        <span className="text-xs">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        {item.amount ? (
                            <>
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
};
