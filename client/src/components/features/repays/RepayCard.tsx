import Amount from "@/components/common/Amount";
import Avatar from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { usePermissions } from "@/hooks/usePermissions";
import { useTranslations } from "@/hooks/useTranslations";
import { useModalStore } from "@/store/modals";
import { Repay } from "@/types/schemas/repays";
import {
    IconCalendarEvent,
    IconChevronLeft,
    IconEdit,
} from "@tabler/icons-react";

type RepayCardProps = {
    repay: Repay;
};

function RepayCard({ repay }: RepayCardProps) {
    const { can } = usePermissions();
    const { t, direction, formatDate } = useTranslations();
    const openModal = useModalStore((state) => state.openModal);

    const fromMember = repay.from;
    const toMember = repay.to;
    return (
        <Card
            className="group hover:shadow-md hover:cursor-pointer gap-2"
            onClick={() => openModal("repays", repay)}
        >
            <div
                className="flex items-center justify-between w-full mb-4"
                aria-label="repay-card"
            >
                <div className="flex items-center text-sm font-medium">
                    <Amount amount={repay.amount} />
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-soft ps--1">
                    <IconCalendarEvent className="size-4 stroke-[1.5]" />
                    {formatDate(new Date(repay.date))}
                </div>
            </div>

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
                    <div className="flex items-center gap-2">
                        <Avatar
                            size="sm"
                            src={fromMember.avatar || undefined}
                            alt={fromMember.name}
                        />
                        <span>{fromMember.name}</span>
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

            <div className="w-full flex items-center justify-between border-t border-border-subtle pt-2 text-muted mt-2">
                <div className="flex items-center gap-2">
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
                        data={generateMemberReport(member, memberBalance)}
                        className="size-8 p-1 text-muted"
                    /> */}
                </div>
                <Button
                    variant="ghost"
                    className="size-8 p-1 text-muted"
                    onPress={() => openModal("repays", repay)}
                >
                    <IconChevronLeft className="size-4 text-muted group-hover:stroke-[2.5] group-hover:text-action" />
                </Button>
            </div>
        </Card>
    );
}

export default RepayCard;
