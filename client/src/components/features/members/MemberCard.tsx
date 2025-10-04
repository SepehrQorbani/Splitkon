import Amount from "@/components/common/Amount";
import Avatar from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import CopyButton from "@/components/common/CopyButton";
import ProgressBar from "@/components/common/ProgressBar";
import { usePermissions } from "@/hooks/usePermissions";
import { useReportGenerator } from "@/hooks/useReportGenerator";
import { useTranslations } from "@/hooks/useTranslations";
import { useBalanceStore } from "@/store/balance";
import { useModalStore } from "@/store/modals";
import { Member } from "@/types/schemas/members";
import { hasRole } from "@/utils/checkRoles";
import {
    IconChecks,
    IconChevronLeft,
    IconCurrencyDollar,
    IconHexagonFilled,
    IconPercentage,
    IconTransfer,
    IconUserEdit,
} from "@tabler/icons-react";
import { Heading } from "react-aria-components";

type MemberCardProps = {
    member: Member;
};

function MemberCard({ member }: MemberCardProps) {
    if (!member.status) {
        return null;
    }

    const { can } = usePermissions();
    const { t } = useTranslations();
    const balance = useBalanceStore((state) => state.balance);
    const { status } = member;
    const openModal = useModalStore((state) => state.openModal);

    const memberBalance = balance?.[member.id] || [];

    const { generateMemberReport } = useReportGenerator();

    return (
        <Card
            className="group hover:shadow-md hover:cursor-pointer gap-2"
            onClick={() => openModal("members", member)}
        >
            <div className="flex items-center gap-2 w-full h-12">
                <Avatar src={member?.avatar} alt={member.name} size="lg" />
                <div className="">
                    <Heading slot="title">
                        <div className="text-sm font-medium flex items-center gap-1">
                            {member.name}
                            {hasRole("default", member) && (
                                <span className="size-4 relative inline-flex items-center justify-center">
                                    {/* <IconRosetteFilled className="size-5 text-action absolute inset-0" /> */}
                                    <IconHexagonFilled className="size-full text-action absolute inset-0" />
                                    <IconCurrencyDollar
                                        stroke={2.5}
                                        className="size-2.5 text-action-faint rounded-full relative"
                                    />
                                </span>
                            )}
                        </div>
                    </Heading>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <IconPercentage className="w-3 h-3" />
                        <span className="text-xs text-gray-500">
                            {member.ratio}
                        </span>
                        <span className="text-[10px]">
                            {t("attributes.ratio_unit")}
                        </span>
                    </div>
                </div>

                <div className={`flex flex-col gap-1.5 ms-auto items-end`}>
                    <div className="text-sm font-medium">
                        {status.title === "settled" ? (
                            <IconChecks className="size-4 text-settled" />
                        ) : (
                            <Amount amount={status.net} />
                        )}
                    </div>
                    <div
                        className={`flex items-center justify-end gap-1 text-xs text-${status.title} font-bold`}
                    >
                        <span
                            className={`size-2 rounded-full bg-${status.title}-subtle border border-${status.title}`}
                        />
                        <span>{t(status.title)}</span>
                    </div>
                </div>
            </div>
            <div>
                <ProgressBar
                    className="mt-6 space-y-1"
                    label={t(status.title)}
                    value={status.percent}
                    color={status.title}
                    remainFlag={status.percent < 100}
                    remainColor="settled"
                    percentageMode="plain"
                />
            </div>
            <div className="w-full flex items-center justify-between border-t border-border-subtle pt-2 text-muted">
                <div className="flex items-center gap-2">
                    {can("editMembers") && (
                        <Button
                            onPress={() => {
                                openModal("member-form", member);
                            }}
                            intent="neutral"
                            variant="ghost"
                            className="h-8 w-8 p-1"
                        >
                            <IconUserEdit className="size-4 text-muted" />
                        </Button>
                    )}
                    {can("addRepays") && (
                        <Button
                            onPress={() => {
                                openModal("repay-form", "from-" + member.id);
                            }}
                            intent="neutral"
                            variant="ghost"
                            className="h-8 w-8 p-1"
                        >
                            <IconTransfer className="size-4 text-muted" />
                        </Button>
                    )}
                    <CopyButton
                        data={generateMemberReport(member, memberBalance)}
                        className="size-8 p-1 text-muted"
                    />
                </div>
                <Button
                    variant="ghost"
                    className="size-8 p-1 text-muted"
                    onPress={() => openModal("members", member)}
                >
                    <IconChevronLeft className="size-4 text-muted group-hover:stroke-[2.5] group-hover:text-action" />
                </Button>
            </div>
        </Card>
    );
}

export default MemberCard;
