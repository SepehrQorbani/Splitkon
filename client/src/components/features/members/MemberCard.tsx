import Amount from "@/components/common/Amount";
import Avatar from "@/components/common/Avatar";
import CopyButton from "@/components/common/CopyButton";
import { Drawer } from "@/components/common/Drawer";
import ExpandableCard from "@/components/common/ExpandableCard";
import ProgressBar from "@/components/common/ProgressBar";
import BalanceCard from "@/components/features/balance/BalanceCard";
import { RepaysForm } from "@/components/features/repays/RepayForm";
import { usePermissions } from "@/hooks/usePermissions";
import { useReportGenerator } from "@/hooks/useReportGenerator";
import { useTranslations } from "@/hooks/useTranslations";
import { useBalanceStore } from "@/store/balance";
import { Member } from "@/types/schemas/members";
import { hasRole } from "@/utils/checkRoles";
import { cn } from "@/utils/cn";
import {
    IconChecks,
    IconCreditCard,
    IconCurrencyDollar,
    IconDots,
    IconPercentage,
    IconReceiptDollar,
    IconTransfer,
    IconUserEdit,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { Heading } from "react-aria-components";
import MemberForm from "./MemberForm";

type MemberCardProps = {
    member: Member;
};

function MemberCard({ member }: MemberCardProps) {
    const { can } = usePermissions();
    const { t } = useTranslations();
    const balance = useBalanceStore((state) => state.balance);

    const memberBalance = balance?.[member.id] || [];
    const id = `member-${member.id}`;
    const netAmount = member.payment_balance - member.total_expenses;
    const status =
        netAmount === 0 ? "settled" : netAmount > 0 ? "creditor" : "debtor";
    const statusText =
        netAmount === 0
            ? t("statusSettled")
            : netAmount > 0
            ? t("statusCreditor")
            : t("statusDebtor");

    const { generateMemberReport } = useReportGenerator();

    const statusPercent =
        netAmount === 0
            ? 100
            : netAmount > 0 && member.payment_balance !== 0
            ? Math.abs(netAmount / member.payment_balance) * 100
            : netAmount < 0 && member.total_expenses !== 0
            ? Math.abs(netAmount / member.total_expenses) * 100
            : 100;
    // text-creditor-strong text-debtor-strong text-settled-strong
    // text-settled text-creditor text-debtor
    return (
        <ExpandableCard id={id}>
            {({ isOpen }) => (
                <motion.div
                    layoutId={`${id}-card-content`}
                    className={cn(
                        "relative bg-surface w-full p-4 rounded ring-1 ring-border space-y-4 shadow-sm overflow-y-auto max-h-full",
                        isOpen
                            ? "shadow-lg overflow-y-auto"
                            : "hover:shadow-md hover:cursor-pointer"
                    )}
                >
                    <motion.div
                        layoutId={`${id}-header`}
                        className="flex items-center gap-2 w-full h-12"
                    >
                        <Avatar
                            src={member?.avatar}
                            alt={member.name}
                            size="lg"
                        />
                        <div className="">
                            <Heading slot="title">
                                <div className="text-sm font-medium flex items-center gap-1">
                                    {member.name}
                                    {hasRole("default", member) && (
                                        <IconCurrencyDollar
                                            stroke={2.5}
                                            className="size-4 bg-action p-0.5 text-action-faint rounded-full"
                                        />
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

                        <div
                            className={`flex flex-col gap-1.5 ms-auto items-end`}
                        >
                            <div className="text-sm font-medium">
                                {status === "settled" ? (
                                    <IconChecks className="size-4 text-settled" />
                                ) : (
                                    <Amount amount={netAmount} />
                                )}
                            </div>
                            <div
                                className={`flex items-center justify-end gap-1 text-xs text-${status} font-bold`}
                            >
                                <span
                                    className={`size-2 rounded-full bg-${status}-subtle border border-${status}`}
                                />
                                <span>{statusText}</span>
                            </div>
                        </div>
                    </motion.div>

                    {isOpen && (
                        <>
                            {member.bank_info && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: 0.1, duration: 0.3 }}
                                    className="bg-background rounded-md p-2 flex items-center gap-2 justify-between"
                                >
                                    <div className="flex items-center gap-1 text-[10px] text-muted">
                                        <IconCreditCard className="size-4 text-muted-soft" />
                                        <span>{t("bank_info")}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="shrink-0 text-xs font-medium"
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
                                </motion.div>
                            )}

                            {memberBalance.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: 0.1, duration: 0.3 }}
                                    className="my-8 space-y-2"
                                >
                                    <h3 className="text-sm font-medium text-muted">
                                        {t("ui.accountBalances")}
                                    </h3>

                                    {memberBalance?.map(
                                        (transaction, index) => (
                                            <BalanceCard
                                                key={index}
                                                transaction={transaction}
                                                member={member}
                                            />
                                        )
                                    )}
                                </motion.div>
                            )}
                        </>
                    )}

                    <motion.div layoutId={`${id}-progress-chart`}>
                        <ProgressBar
                            className="mt-6 space-y-1"
                            label={statusText}
                            value={statusPercent}
                            color={status}
                            remainFlag={statusPercent < 100}
                            remainColor="settled"
                            percentageMode="plain"
                        />
                    </motion.div>

                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                            className="mt-4 space-y-2"
                        >
                            <div className="flex items-center justify-between gap-2 p-2 text-xs rounded bg-muted/10 border border-border">
                                <div className="flex items-center gap-1">
                                    <IconReceiptDollar className="size-4 text-muted" />
                                    <span>مجموع هزینه ها:</span>
                                </div>
                                <div>
                                    <Amount amount={member.total_expenses} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-2 p-2 text-xs rounded bg-muted/10 border border-border">
                                <div className="flex items-center gap-1">
                                    <IconReceiptDollar className="size-4 text-muted" />
                                    <span>مجموع پرداخت ها:</span>
                                </div>
                                <div>
                                    <Amount amount={member.payment_balance} />
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div className="w-full flex items-center justify-between border-t border-border-subtle pt-2 text-muted">
                        <div className="flex items-center gap-2">
                            {can("editMembers") && (
                                <Drawer
                                    triggerLabel={
                                        <IconUserEdit className="size-4" />
                                    }
                                    title={t("ui.edit")}
                                    children={({ close }) => (
                                        <MemberForm
                                            onSubmitSuccess={(data) => {
                                                close();
                                            }}
                                            member={member}
                                        />
                                    )}
                                    buttonProps={{
                                        variant: "ghost",
                                        className: "size-8 p-1 text-muted",
                                    }}
                                />
                            )}
                            {can("addRepays") && (
                                <Drawer
                                    triggerLabel={
                                        <>
                                            <IconTransfer className="w-4 h-4" />
                                        </>
                                    }
                                    title={t("repay")}
                                    children={({ close }) => (
                                        <RepaysForm
                                            defaultValue={{
                                                from_id: member.id,
                                            }}
                                            onSubmitSuccess={(data) => {
                                                console.log(data);
                                                close();
                                            }}
                                        />
                                    )}
                                    buttonProps={{
                                        variant: "ghost",
                                        className: "size-8 p-1 text-muted",
                                    }}
                                />
                            )}
                            <CopyButton
                                data={generateMemberReport(
                                    member,
                                    memberBalance
                                )}
                                className="size-8 p-1 text-muted"
                            />
                        </div>
                        {!isOpen && <IconDots className="size-4" />}
                    </div>
                </motion.div>
            )}
        </ExpandableCard>
    );
}

export default MemberCard;
