import { z } from "zod";
import { Member } from "./members";

export type ExpenseMember = Member & {
    share: number;
    remainder: number;
};

export interface DailyExpense {
    date: string;
    total: number;
}
export type DailyExpenses = DailyExpense[];

export type Expense = {
    id: number;
    title: string;
    amount: number;
    date: string;
    split: number;
    spender: Member;
    members: ExpenseMember[];
    description?: string;
};

export const ExpenseInputSchema = (
    t: (key: string, params?: Record<string, string>) => string
) =>
    z.object({
        title: z
            .string()
            .nonempty(
                t("validation.required", { attribute: t("attributes.title") })
            ),
        amount: z
            .number({
                required_error: t("validation.required", {
                    attribute: t("attributes.amount"),
                }),
                invalid_type_error: t("validation.required", {
                    attribute: t("attributes.amount"),
                }),
            })
            .min(
                1,
                t("validation.min", {
                    attribute: t("attributes.amount"),
                    min: "1",
                })
            ),
        date: z
            .string({
                required_error: t("validation.required", {
                    attribute: t("attributes.date"),
                }),
            })
            .refine(
                (value) => {
                    try {
                        new Date(value);
                        return true;
                    } catch {
                        return false;
                    }
                },
                {
                    message: t("validation.date", {
                        attribute: t("attributes.date"),
                    }),
                    path: ["date"],
                }
            ),
        spender_id: z.number({
            required_error: t("validation.required", {
                attribute: t("attributes.spender"),
            }),
        }),
        members: z
            .array(
                z.object({
                    id: z.number(),
                    name: z.string(),
                    avatar: z.string(),
                    ratio: z.number().min(
                        1,
                        t("validation.min", {
                            attribute: t("attributes.ratio"),
                            min: "1",
                        })
                    ),
                })
            )
            .nonempty(
                t("validation.required", { attribute: t("attributes.members") })
            ),
        description: z.string().optional(),
    });
export type ExpenseInput = z.infer<ReturnType<typeof ExpenseInputSchema>>;
