import Amount from "@/components/common/Amount";
import Avatar from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";
import { GenericTable } from "@/components/common/GenericTable";
import { usePermissions } from "@/hooks/usePermissions";
import { useTranslations } from "@/hooks/useTranslations";
import RepaysFilter from "@/pages/repays/filters";
import { useModalStore } from "@/store/modals";
import { Repay } from "@/types/schemas/repays";
import { repayFilterConfig } from "@/utils/filters/repayFilterConfig";
import { IconCalendarEvent, IconEdit, IconEye } from "@tabler/icons-react";

export default function RepaysTable({ repays }: { repays: Repay[] }) {
    const { t, formatDate } = useTranslations();
    const openModal = useModalStore((state) => state.openModal);

    return (
        <GenericTable<Repay>
            items={repays}
            filterConfig={repayFilterConfig}
            FilterComponent={RepaysFilter}
            columns={[
                {
                    key: "from",
                    label: t("attributes.from"),
                    sortable: true,
                    thClassName: "sticky top-0 right-0 bg-background z-2 ps-12",
                    className:
                        "sticky top-0 right-0 bg-surface z-2 cursor-pointer",
                    render: (repay) => (
                        <div
                            className="flex items-center gap-2"
                            onClick={() => {
                                openModal("repays", repay);
                            }}
                        >
                            <Avatar
                                src={repay.from?.avatar}
                                alt={repay.from?.name}
                                size="md"
                            />
                            <div className="flex items-center gap-1">
                                {repay.from?.name}
                            </div>
                        </div>
                    ),
                },
                {
                    key: "to",
                    label: t("attributes.to"),
                    sortable: true,
                    thClassName: "sticky top-0 right-0 bg-background z-2 ps-12",
                    render: (repay) => (
                        <div className="flex items-center gap-2">
                            <Avatar
                                src={repay.to?.avatar}
                                alt={repay.to?.name}
                                size="md"
                            />
                            <div className="flex items-center gap-1">
                                {repay.to?.name}
                            </div>
                        </div>
                    ),
                },
                {
                    key: "amount",
                    label: t("ui.amount"),
                    sortable: true,
                    render: (repay) => (
                        <div>
                            <Amount amount={repay.amount} />
                        </div>
                    ),
                },
                {
                    key: "date",
                    label: t("attributes.date"),
                    sortable: true,
                    render: (repay) => (
                        <div className="flex items-center text-xs text-muted gap-1">
                            <IconCalendarEvent className="size-3" />
                            {formatDate(new Date(repay.date))}
                        </div>
                    ),
                },
                {
                    key: "actions",
                    label: "",
                    render: (repay) => <Actions repay={repay} />,
                },
            ]}
        />
    );
}

const Actions = ({ repay }: { repay: Repay }) => {
    const { can } = usePermissions();
    const { t } = useTranslations();
    // const { generateRepayReport } = useReportGenerator();
    const openModal = useModalStore((state) => state.openModal);

    return (
        <div>
            <Button
                onPress={() => {
                    openModal("repays", repay);
                }}
                intent="neutral"
                variant="ghost"
                className="h-8 w-8 p-1"
            >
                <IconEye className="w-4 h-4 text-muted" />
            </Button>

            {can("editRepays") && (
                <Button
                    onPress={() => {
                        openModal("repay-form", repay);
                    }}
                    intent="neutral"
                    variant="ghost"
                    className="h-8 w-8 p-1"
                >
                    <IconEdit className="w-4 h-4 text-muted" />
                </Button>
            )}
            {/* <CopyButton
                data={generateExpenseReport(repay)}
                className="h-8 w-8 p-1"
            /> */}
        </div>
    );
};
