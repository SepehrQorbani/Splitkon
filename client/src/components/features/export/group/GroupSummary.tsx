import Amount from "@/components/common/Amount";
import { useTranslations } from "@/hooks/useTranslations";
import { Summary } from "@/types/schemas/summary";

export const GroupSummary = ({ summary }: { summary: Summary | null }) => {
    const { t } = useTranslations();
    if (!summary) return null;

    const items = [
        {
            label: `${t("ui.expenses")} (${t("ui.total")}: ${
                summary.expenses_count
            })`,
            amount: summary.total_expenses,
        },
        {
            label: `${t("ui.repays")} (${t("ui.total")}: ${
                summary.repays_count
            })`,
            amount: summary.total_repays,
        },
        {
            label: t("ui.outstanding"),
            amount: summary.total_outstanding,
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
                                        <Amount
                                            showUnit={false}
                                            amount={item.amount ?? 0}
                                        />
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
};
