import { Expense } from "@/types/schemas/expenses";
import { Repay } from "@/types/schemas/repays";
import { Member } from "@/types/schemas/members";

export type NetBalance = {
    id: number;
    net: number;
};

export type PendingBalance = {
    from: number;
    to: number;
    amount: number;
};

export type Summary = {
    members_count: number;
    expenses_count: number;
    repays_count: number;
    days_count: number;
    total_ratio: number;
    total_expenses: number;
    total_repays: number;
    total_outstanding: number;
    balance_status: "تراز شده" | "تراز نشده";
    net_balances: NetBalance[];
    pending_balances: PendingBalance[];
    recent_activity: {
        date: string;
        expenses: Expense[];
        repays: Repay[];
    }[];
};
