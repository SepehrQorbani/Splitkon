import Amount from "@/components/common/Amount";
import Avatar from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";
import CopyButton from "@/components/common/CopyButton";
import { GenericTable } from "@/components/common/GenericTable";
import ProgressBar from "@/components/common/ProgressBar";
import { usePermissions } from "@/hooks/usePermissions";
import { useReportGenerator } from "@/hooks/useReportGenerator";
import { useTranslations } from "@/hooks/useTranslations";
import MembersFilter from "@/pages/members/filters";
import { useBalanceStore } from "@/store";
import { useModalStore } from "@/store/modals";
import { Member, Members } from "@/types";
import { hasRole } from "@/utils/checkRoles";
import { memberFilterConfig } from "@/utils/filters/memberConfig";
import {
    IconCurrencyDollar,
    IconEye,
    IconHexagonFilled,
    IconPercentage,
    IconTransfer,
    IconUserEdit,
} from "@tabler/icons-react";

export default function MembersTable({
    members,
    onSelectMember,
}: {
    members: Members;
    onSelectMember: (member: Member | null) => void;
}) {
    const { t } = useTranslations();

    return (
        <GenericTable<Member>
            items={members}
            filterConfig={memberFilterConfig}
            FilterComponent={MembersFilter}
            columns={[
                {
                    key: "name",
                    label: t("attributes.name"),
                    sortable: true,
                    thClassName: "sticky top-0 right-0 bg-background z-2",
                    className: "sticky top-0 right-0 bg-surface z-2",
                    render: (member) => (
                        <div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => onSelectMember(member)}
                        >
                            <Avatar
                                src={member?.avatar}
                                alt={member.name}
                                size="md"
                            />
                            <div>
                                <div className="flex items-center gap-1">
                                    {member.name}
                                    {hasRole("default", member) && (
                                        <span className="size-4 relative inline-flex items-center justify-center">
                                            <IconHexagonFilled className="size-full text-action absolute inset-0" />
                                            <IconCurrencyDollar
                                                stroke={2.5}
                                                className="size-2.5 text-action-faint rounded-full relative"
                                            />
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <IconPercentage className="w-3 h-3" />
                                    <span>{member.ratio}</span>
                                    <span className="text-[10px]">
                                        {t("attributes.ratio_unit")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    key: "bank_info",
                    label: t("attributes.bank_info"),
                    thClassName: "hidden md:table-cell",
                    className: "hidden md:table-cell",
                    render: (member) =>
                        member.bank_info && (
                            <div className="flex items-center">
                                <span
                                    className="shrink-0 text-xs font-medium font-mono"
                                    dir="ltr"
                                >
                                    {member.bank_info.replace(
                                        /(\S{4})(?=\S)/g,
                                        "$1 - "
                                    )}
                                </span>
                                <CopyButton
                                    data={member.bank_info}
                                    className="size-6 text-muted shrink-0"
                                    iconSize="size-3"
                                />
                            </div>
                        ),
                },
                {
                    key: "balance",
                    label: t("ui.accountBalance"),
                    render: (member) => (
                        <Amount amount={member.status?.net} showUnit={false} />
                    ),
                },
                {
                    key: "status",
                    label: t("attributes.status"),
                    sortable: true,
                    render: (member) =>
                        member.status ? (
                            <div
                                className={`flex items-center gap-1 text-xs text-${member.status.title} font-bold`}
                            >
                                <span
                                    className={`size-2 rounded-full bg-${member.status.title}-subtle border border-${member.status.title}`}
                                />
                                <span>{t(member.status.title)}</span>
                            </div>
                        ) : null,
                },
                {
                    key: "progress",
                    label: "",
                    render: (member) =>
                        member?.status && (
                            <ProgressBar
                                className="w-32"
                                value={member.status.percent}
                                color={member.status.title}
                                remainFlag={member.status.percent < 100}
                                remainColor="settled"
                                percentageMode="inline"
                            />
                        ),
                },
                {
                    key: "actions",
                    label: "",
                    render: (member) => <Actions member={member} />,
                },
            ]}
        />
    );
}

const Actions = ({ member }: { member: Member }) => {
    const { can } = usePermissions();
    const { t } = useTranslations();
    const { generateMemberReport } = useReportGenerator();
    const balance = useBalanceStore((state) => state.balance);
    const memberBalance = balance?.[member.id] || [];
    const openModal = useModalStore((state) => state.openModal);

    return (
        <div className="flex items-center gap-2 justify-end">
            <Button
                onPress={() => {
                    openModal("members", member);
                }}
                intent="neutral"
                variant="ghost"
                className="h-8 w-8 p-1"
            >
                <IconEye className="size-4 text-muted" />
            </Button>
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
    );
};
