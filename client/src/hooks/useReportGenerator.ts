import { useUIStore } from "@/store";
import { Summary } from "@/types/schemas/summary";
import { Expense } from "@/types/schemas/expenses";
import { useTranslations } from "./useTranslations";
import {
    generateExpenseDetails,
    generateGroupSummary,
    generateMemberSummary,
} from "@/utils/reportGenerator";
import { useMemberStore } from "@/store/members";
import { BalanceTransaction } from "@/types/schemas/balance";
import { Member } from "@/types/schemas/members";
import { useGroupStore } from "@/store/group";

export function useReportGenerator() {
    const language = useUIStore((state) => state.language);
    const group = useGroupStore((state) => state.group);
    const getMember = useMemberStore((state) => state.getMember);
    const locale = language === "fa" ? "fa-IR" : "en-US";
    const { t } = useTranslations();
    const currency = language === "fa" ? "تومان" : "IRR";

    const options = {
        locale,
        currency,
        t,
    };
    if (!group) return;

    return {
        generateExpenseReport: (expense: Expense) =>
            generateExpenseDetails(expense, options),
        generateGroupReport: (summary: Summary) =>
            generateGroupSummary({ group, summary }, getMember, options),
        generateMemberReport: (
            member: Member,
            relatedBalances: BalanceTransaction[]
        ) => generateMemberSummary(member, relatedBalances, getMember, options),
    };
}
