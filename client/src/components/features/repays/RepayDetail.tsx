import Amount from "@/components/common/Amount";
import Avatar from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";
import { usePermissions } from "@/hooks/usePermissions";
import { useTranslations } from "@/hooks/useTranslations";
import { useModalStore } from "@/store/modals";
import { Repay } from "@/types/schemas/repays";
import {
    IconCalendarEvent,
    IconCurrencyDollar,
    IconEdit,
    IconX,
} from "@tabler/icons-react";

type Props = {};

function RepayDetail({
    repay,
    onClose,
}: {
    repay: Repay | null;
    onClose: () => void;
}) {
    const { t, direction } = useTranslations();

    const fromMember = repay?.from;
    const toMember = repay?.to;
    return (
        fromMember &&
        toMember &&
        repay && (
            <div className="px-2 space-y-4 mb-4">
                <div>
                    <div className="relative w-full flex justify-between items-center px-2 pt-2 mb-2">
                        {direction === "rtl" ? (
                            <>
                                <div className="absolute left-3 right-3 top-0 bottom-0 border rounded border-b-0 border-dashed border-border h-5" />
                                <span className="rounded-xs size-2 border border-border shrink-0 bg-surface relative" />
                                <span className="rounded-xs size-2 border border-border shrink-0 bg-surface relative" />
                            </>
                        ) : (
                            <>
                                <div className="absolute left-3 right-3 top-0 bottom-0 border rounded border-b-0 border-dashed border-border h-5" />
                                <span className="rounded-xs size-2 border border-border shrink-0 bg-surface relative" />
                                <span className="rounded-xs size-2 border border-border shrink-0 bg-surface relative" />
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-xs justify-between">
                        <div className="space-y-2">
                            <div className="text-start text-muted">
                                {t("ui.fromMember")}
                            </div>
                            <div className="flex items-center gap-2">
                                <Avatar
                                    size="sm"
                                    src={fromMember.avatar || undefined}
                                    alt={fromMember.name}
                                />
                                <span>{fromMember.name}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-end text-muted">
                                {t("ui.toMember")}
                            </div>
                            <div className="flex items-center gap-2">
                                <span>{toMember.name}</span>
                                <Avatar
                                    size="sm"
                                    src={toMember.avatar || undefined}
                                    alt={toMember.name}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {repay.description && (
                    <div className="text-xs bg-background rounded border border-border p-2 mt-8">
                        <p className="font-medium mb-2">
                            {t("attributes.description")}:
                        </p>
                        {repay.description}
                    </div>
                )}
            </div>
        )
    );
}

export default RepayDetail;

export function RepayDetailTitle({
    repay,
    onClose,
}: {
    repay: Repay | null;
    onClose: () => void;
}) {
    const { t, formatDate } = useTranslations();
    const { can } = usePermissions();
    const openModal = useModalStore((state) => state.openModal);

    return (
        repay && (
            <div className="">
                <div
                    className="w-full sticky top-0 bg-surface pb-2 flex items-center justify-between"
                    aria-label="repay-detail-title"
                >
                    <h3>
                        <IconCurrencyDollar className="inline size-4 text-muted" />
                        <Amount amount={repay.amount} />
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                        {can("editRepays") && (
                            <Button
                                onPress={() => {
                                    openModal("repay-form", repay.id);
                                }}
                                intent="neutral"
                                variant="ghost"
                                className="h-8 w-8 p-1"
                            >
                                <IconEdit className="w-4 h-4 text-muted" />
                            </Button>
                        )}
                        {/* <CopyButton
                            data={generaterepayReport(repay)}
                            className="h-8 w-8 p-1"
                        /> */}
                        <Button
                            variant="ghost"
                            className="size-8 p-1 text-muted"
                            onPress={onClose}
                        >
                            <IconX className="size-4" />
                        </Button>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-soft">
                    <IconCalendarEvent className="size-4" />
                    {formatDate(new Date(repay.date))}
                </div>
            </div>
        )
    );
}
