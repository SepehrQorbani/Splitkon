import Amount from "@/components/common/Amount";
import Avatar from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";
import CopyButton from "@/components/common/CopyButton";
import ProgressBar from "@/components/common/ProgressBar";
import { usePermissions } from "@/hooks/usePermissions";
import { useReportGenerator } from "@/hooks/useReportGenerator";
import { useTranslations } from "@/hooks/useTranslations";
import { useBalanceStore } from "@/store";
import { useModalStore } from "@/store/modals";
import { Member } from "@/types";
import { hasRole } from "@/utils/checkRoles";
import {
    IconChecks,
    IconCreditCard,
    IconCurrencyDollar,
    IconHexagonFilled,
    IconPercentage,
    IconReceiptDollar,
    IconTransfer,
    IconUserEdit,
    IconX,
} from "@tabler/icons-react";
import { Heading } from "react-aria-components";
import BalanceCard from "../balance/BalanceCard";
import BankLogo from "@/components/common/BankLogo";

type Props = { member: Member | null; onClose: () => void };

function MemberDetail({ member, onClose }: Props) {
    const { t } = useTranslations();
    const balance = useBalanceStore((state) => state.balance);

    const memberBalance = (member && balance?.[member?.id]) || [];
    const status = (member && member.status) || null;

    return (
        status &&
        member && (
            <div>
                <div className="px-2">
                    <div className="flex items-center gap-2 w-full h-12 justify-between">
                        <div
                            className={`flex items-center justify-end gap-1 text-xs text-${status?.title} font-bold`}
                        >
                            <span
                                className={`size-2 rounded-full bg-${status?.title}-subtle border border-${status?.title}`}
                            />
                            <span>{t(status?.title)}</span>
                        </div>
                        <div className="text-sm font-medium">
                            {status?.title === "settled" ? (
                                <IconChecks className="size-4 text-settled" />
                            ) : (
                                <Amount amount={status?.net} />
                            )}
                        </div>
                    </div>
                    {member?.bank_info && (
                        <div className="bg-background rounded-md p-2 flex items-center gap-2 justify-between">
                            <div className="flex items-center gap-1 text-[10px] text-muted">
                                <IconCreditCard className="size-4 text-muted-soft" />
                                <span>{t("attributes.bank_info")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span
                                    className="shrink-0 text-xs font-medium font-mono"
                                    dir="ltr"
                                >
                                    {member?.bank_info.replace(
                                        /(\S{4})(?=\S)/g,
                                        "$1 - "
                                    )}
                                </span>
                                <CopyButton
                                    data={member?.bank_info}
                                    className="size-8 text-muted shrink-0"
                                    iconSize="size-4"
                                    copyIcon={
                                        <BankLogo
                                            account={member.bank_info}
                                            className="size-6"
                                        />
                                    }
                                />
                            </div>
                        </div>
                    )}
                    {memberBalance.length > 0 && (
                        <div className="my-8 space-y-2">
                            <h3 className="text-sm font-medium text-muted">
                                {t("ui.accountBalances")}
                            </h3>
                            {memberBalance?.map((transaction, index) => (
                                <BalanceCard
                                    key={index}
                                    transaction={transaction}
                                    member={member}
                                />
                            ))}
                        </div>
                    )}
                    <ProgressBar
                        className="mt-6 space-y-1"
                        label={t(status?.title) || ""}
                        value={status?.percent}
                        color={status?.title}
                        remainFlag={status?.percent < 100}
                        remainColor="settled"
                        percentageMode="plain"
                    />
                    <div className="my-4 space-y-2">
                        <div className="flex items-center justify-between gap-2 p-2 text-xs rounded bg-muted/10 border border-border">
                            <div className="flex items-center gap-1">
                                <IconReceiptDollar className="size-4 text-muted" />
                                <span>مجموع هزینه ها:</span>
                            </div>
                            <div>
                                <Amount amount={member?.total_expenses} />
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-2 p-2 text-xs rounded bg-muted/10 border border-border">
                            <div className="flex items-center gap-1">
                                <IconReceiptDollar className="size-4 text-muted" />
                                <span>مجموع پرداخت ها:</span>
                            </div>
                            <div>
                                <Amount amount={member?.payment_balance} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
}

export default MemberDetail;

export function MemberDetailTitle({
    member,
    onClose,
}: {
    member: Member;
    onClose: () => void;
}) {
    const { t } = useTranslations();
    const status = (member && member.status) || null;
    const balance = useBalanceStore((state) => state.balance);
    const memberBalance = (member && balance?.[member?.id]) || [];
    const { can } = usePermissions();
    const openModal = useModalStore((state) => state.openModal);

    const { generateMemberReport } = useReportGenerator();
    return (
        status && (
            <div className="flex items-start justify-between">
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
                </div>

                <div className="flex items-center gap-2 shrink-0">
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
                        className="size-8 p-1 text-action"
                    />
                    <Button
                        variant="ghost"
                        className="size-8 p-1 text-muted"
                        onPress={onClose}
                    >
                        <IconX className="size-4" />
                    </Button>
                </div>
            </div>
        )
    );
}
