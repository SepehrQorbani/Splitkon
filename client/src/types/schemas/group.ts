import { z } from "zod";
import { MemberInputSchema } from "./members";

export const CurrencySchema = z.object({
    code: z.string(),
    display_unit: z.string(),
    conversion_factor: z.number(),
    decimal_precision: z.number(),
});

export type Currency = z.infer<typeof CurrencySchema>;

export const GroupSchema = z.object({
    id: z.number(),
    title: z.string(),
    date: z.string(),
    closing_date: z.string().nullable(),
    currency: CurrencySchema,
    description: z.string().optional(),
    view_token: z.string(),
    edit_token: z.string().nullable(),
    last_expense_date: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
});

export type Group = z.infer<typeof GroupSchema>;

export const GroupInputSchema = (
    t: (key: string, params?: Record<string, string>) => string
) =>
    z.object({
        id: z.number().optional(),
        title: z
            .string()
            .nonempty(
                t("validation.required", { attribute: t("attributes.title") })
            ),
        currency: CurrencySchema,
        description: z.string().optional(),
        date: z
            .string({
                required_error: t("validation.required", {
                    attribute: t("attributes.date"),
                }),
            })
            .date(),
        members: z.array(MemberInputSchema(t)).optional(),
    });

export type GroupInput = z.infer<ReturnType<typeof GroupInputSchema>>;

export const GroupEditInputSchema = (
    t: (key: string, params?: Record<string, string>) => string,
    formatDate: (
        date: Date | string,
        options?: Intl.DateTimeFormatOptions
    ) => string,
    group: Group
) =>
    z
        .object({
            title: z
                .string()
                .nonempty(
                    t("validation.required", {
                        attribute: t("attributes.title"),
                    })
                )
                .optional(),
            date: z
                .string()
                .optional()
                .refine(
                    (value) => {
                        if (!value) return true; // Optional field
                        try {
                            new Date(value); // Ensure it's a valid date
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
            description: z.string().nullable().optional(),
            currency: CurrencySchema.optional(),
            closing_date: z
                .string()
                .nullable()
                .optional()
                .refine(
                    (value) => {
                        if (!value) return true; // Nullable and optional
                        try {
                            new Date(value); // Ensure it's a valid date
                            return true;
                        } catch {
                            return false;
                        }
                    },
                    {
                        message: t("validation.date", {
                            attribute: t("attributes.closing_date"),
                        }),
                        path: ["closing_date"],
                    }
                ),
        })
        .refine(
            (data) => {
                if (!data.date || !data.closing_date) return true;
                const date = new Date(data.date).getTime();
                const closingDate = new Date(data.closing_date).getTime();
                return date <= closingDate;
            },
            {
                message: t("validation.before_closing_date"),
                path: ["date"],
            }
        )
        .refine(
            (data) => {
                if (!data.closing_date || !group?.last_expense_date)
                    return true;
                const closingDate = new Date(data.closing_date).getTime();
                const lastExpenseDate = new Date(
                    group.last_expense_date
                ).getTime();
                return closingDate >= lastExpenseDate;
            },
            {
                message: t("validation.after_last_expense", {
                    min: formatDate(group?.last_expense_date || ""),
                }),
                path: ["closing_date"],
            }
        )
        .refine(
            (data) => {
                if (!data.closing_date || !data.date) return true;
                const closingDate = new Date(data.closing_date).getTime();
                const date = new Date(data.date).getTime();
                return closingDate >= date;
            },
            {
                message: t("validation.after_date"),
                path: ["closing_date"],
            }
        );

export type GroupEditInput = z.infer<ReturnType<typeof GroupEditInputSchema>>;
