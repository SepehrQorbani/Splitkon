import { Summary } from "@/types/schemas/summary";
import { Expense, ExpenseMember } from "@/types/schemas/expenses";
import { Member } from "@/types/schemas/members";
import { BalanceTransaction } from "@/types/schemas/balance";
import { Repay } from "@/types/schemas/repays";
import { Group } from "@/types/schemas/group";

// Constants for Emojis
const EMOJIS = {
    STATUS_BALANCED: "✅",
    STATUS_UNBALANCED: "❌",
    MEMBER_CREDITOR: "✅",
    MEMBER_DEBTOR: "🚫",
    MEMBER_SETTLED: "⚪",
    EXPENSE: "💰",
    REPAY: "💸",
    MEMBER: "👤",
    ARROW_RIGHT: "➡️",
    ARROW_LEFT: "⬅️",
    DOLLAR: "💲",
    DATE: "📅",
    TITLE: "🏷️",
    DESCRIPTION: "📝",
    TRANSFER: "↔️",
    AMOUNT: "💵",
    GROUP: "🗂",
    STAT: "📊",
};

const UNKNOWN_MEMBER_NAME = "[Unknown Member]";

export interface ReportOptions {
    locale: string;
    currency: string;
    t: (key: string) => string;
}

const defaultOptions: Partial<ReportOptions> = {
    locale: "fa-IR",
    currency: "تومان",
};

function formatCurrency(amount: number, options: ReportOptions): string {
    return `${amount.toLocaleString(options.locale)} ${options.currency}`;
}

function getStatusEmoji(status: "تراز شده" | "تراز نشده"): string {
    return status === "تراز شده"
        ? EMOJIS.STATUS_BALANCED
        : EMOJIS.STATUS_UNBALANCED;
}

function getMemberStatusEmoji(amount: number): string {
    if (amount > 0) return EMOJIS.MEMBER_CREDITOR;
    if (amount < 0) return EMOJIS.MEMBER_DEBTOR;
    return EMOJIS.MEMBER_SETTLED;
}

function formatDate(date: string, locale: string): string {
    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date(date));
}

function formatHeader(
    title: string,
    icon: keyof typeof EMOJIS = "STAT",
    subtitle?: string
): string {
    const sub = subtitle ? ` (${subtitle})` : "";
    return `${EMOJIS[icon]} ${title}${sub}\n${"━".repeat(20)}`;
}

function formatSection(title: string, content: string): string {
    return `\n${title}:\n${content}`;
}

export function generateGroupSummary(
    data: { group: Group; summary: Summary },
    getMember: (id: number) => Member | undefined,
    options: ReportOptions
): string {
    const { t } = options;
    const status = `${getStatusEmoji(data.summary.balance_status)} ${
        data.summary.balance_status
    }`;

    const balancePercent = Math.round(
        data.summary.total_expenses !== 0
            ? ((data.summary.total_expenses - data.summary.total_outstanding) /
                  data.summary.total_expenses) *
                  100
            : 100
    ).toLocaleString(options.locale);

    const debtLines = data.summary.pending_balances
        .map((d) => {
            const fromMemberName =
                getMember(d.from)?.name ?? UNKNOWN_MEMBER_NAME;
            const toMemberName = getMember(d.to)?.name ?? UNKNOWN_MEMBER_NAME;
            return `${
                EMOJIS.ARROW_RIGHT
            } ${fromMemberName} ← ${toMemberName}: ${formatCurrency(
                d.amount,
                options
            )}`;
        })
        .join("\n");

    const memberLines = data.summary.net_balances
        .map((m) => {
            const memberName = getMember(m.id)?.name ?? UNKNOWN_MEMBER_NAME;
            const emoji = getMemberStatusEmoji(m.net);
            const status =
                m.net > 0
                    ? t("statusCreditor")
                    : m.net < 0
                    ? t("statusDebtor")
                    : t("statusSettled");
            return `${emoji} ${memberName}: ${status} ${formatCurrency(
                Math.abs(m.net),
                options
            )}`;
        })
        .join("\n");

    const report = [
        formatHeader(
            data.group.title,
            "GROUP",
            formatDate(data.group.date, options.locale)
        ),
        formatSection(t("ui.groupStatus"), status),
        `${t("ui.balancePercent")}: ${balancePercent}%`,
        formatSection(
            t("ui.finances"),
            `${EMOJIS.EXPENSE} ${t("ui.totalExpenses")}: ${formatCurrency(
                data.summary.total_expenses,
                options
            )}
${EMOJIS.DOLLAR} ${t("ui.outstanding")}: ${formatCurrency(
                data.summary.total_outstanding,
                options
            )}`
        ),
        formatSection(
            t("ui.groupStats"),
            `${EMOJIS.MEMBER} ${t(
                "ui.membersCount"
            )}: ${data.summary.members_count.toLocaleString(
                options.locale
            )} ${t("ui.person")}
${EMOJIS.EXPENSE} ${t(
                "ui.expensesCount"
            )}: ${data.summary.expenses_count.toLocaleString(options.locale)}
${EMOJIS.REPAY} ${t(
                "ui.repaysCount"
            )}: ${data.summary.repays_count.toLocaleString(options.locale)}
${EMOJIS.DATE} ${t("ui.daysCount")}: ${data.summary.days_count.toLocaleString(
                options.locale
            )}`
        ),
        formatSection(t("ui.status"), memberLines),
        data.summary.pending_balances.length > 0
            ? formatSection(t("ui.debts"), debtLines)
            : "",
    ]
        .filter(Boolean)
        .join("\n");

    return report;
}

export function generateExpenseDetails(
    expense: Expense,
    options: ReportOptions
): string {
    const { t } = options;

    const shares = expense.members
        .map(
            (share: ExpenseMember) =>
                `${EMOJIS.MEMBER} ${share.name}: ${formatCurrency(
                    share.share,
                    options
                )}`
        )
        .join("\n");

    const report = [
        formatHeader(t("ui.expenseDetails")),
        formatSection(
            t("ui.info"),
            `${EMOJIS.TITLE} ${t("attributes.title")}: ${expense.title}
${EMOJIS.DOLLAR} ${t("attributes.amount")}: ${formatCurrency(
                expense.amount,
                options
            )}
${EMOJIS.DATE} ${t("attributes.date")}: ${formatDate(
                expense.date,
                options.locale
            )}
${EMOJIS.MEMBER} ${t("attributes.spender")}: ${expense.spender.name}`
        ),
        formatSection(t("ui.expenseShare"), shares),
        expense.description
            ? formatSection(t("attributes.description"), expense.description)
            : "",
    ]
        .filter(Boolean)
        .join("\n");

    return report;
}

export function generateMemberSummary(
    member: Member,
    balanceTransactions: BalanceTransaction[],
    getMember: (id: number) => Member | undefined,
    options: ReportOptions
): string {
    const { t } = options;
    const net = member.payment_balance - member.total_expenses;
    const emoji = getMemberStatusEmoji(net);
    const status =
        net > 0
            ? t("ui.statusCreditor")
            : net < 0
            ? t("ui.statusDebtor")
            : t("ui.statusSettled");

    const transactions = balanceTransactions
        .map((b) => {
            const directionEmoji =
                b.amount > 0 ? EMOJIS.ARROW_RIGHT : EMOJIS.ARROW_LEFT;
            const directionKey =
                b.amount > 0 ? "attributes.to" : "attributes.from";
            const targetMemberName =
                getMember(b.to)?.name ?? UNKNOWN_MEMBER_NAME;
            return `${directionEmoji} ${t(directionKey)} ${
                EMOJIS.MEMBER
            }${targetMemberName}: ${formatCurrency(
                Math.abs(b.amount),
                options
            )}`;
        })
        .join("\n");

    const report = [
        formatHeader(t("ui.memberSummary")),
        formatSection(
            t("ui.memberInfo"),
            `${EMOJIS.MEMBER} ${member.name}
${emoji} ${t("ui.status")}: ${status}`
        ),
        formatSection(
            t("ui.finances"),
            `${EMOJIS.EXPENSE} ${t("ui.totalExpenses")}: ${formatCurrency(
                member.total_expenses,
                options
            )}
${EMOJIS.REPAY} ${t("ui.repayment")}: ${formatCurrency(
                member.payment_balance,
                options
            )}
${EMOJIS.DOLLAR} ${t("ui.outstanding")}: ${formatCurrency(
                Math.abs(net),
                options
            )}`
        ),
        balanceTransactions.length > 0
            ? formatSection(
                  net < 0 ? t("ui.debts") : t("ui.credits"),
                  transactions
              )
            : "",
    ]
        .filter(Boolean)
        .join("\n");

    return report;
}

export function generateRepayReport(
    repay: Repay,
    options: ReportOptions
): string {
    const { t } = options;

    const report = [
        formatHeader(t("ui.repayDetails")),
        formatSection(
            t("ui.info"),
            `${EMOJIS.TRANSFER} ${t("attributes.from")} ${EMOJIS.MEMBER}${
                repay.from.name
            } ${EMOJIS.ARROW_RIGHT} ${EMOJIS.MEMBER}${repay.to.name}
${EMOJIS.AMOUNT} ${t("attributes.amount")}: ${formatCurrency(
                repay.amount,
                options
            )}
${EMOJIS.DATE} ${t("attributes.date")}: ${formatDate(
                repay.date,
                options.locale
            )}`
        ),
        repay.description
            ? formatSection(
                  t("attributes.description"),
                  `${EMOJIS.DESCRIPTION} ${repay.description}`
              )
            : "",
    ]
        .filter(Boolean)
        .join("\n");

    return report;
}
