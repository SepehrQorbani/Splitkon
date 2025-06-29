import { z } from "zod";

export const MemberSchema = z.object({
    id: z.number(),
    name: z.string().nonempty(),
    avatar: z.string().nullable().optional(),
    ratio: z.number().min(1).max(100),
    bank_info: z
        .string()
        .nullable()
        .optional()
        .transform((val) => (val ? val.replace(/\D/g, "") : val))
        .refine((val) => !val || val.length === 16, {
            message: "Bank info must be 16 digits",
        })
        .refine((val) => !val || /^\d+$/.test(val), {
            message: "Bank info must be numeric",
        }),
    total_expenses: z.number().default(0),
    payment_balance: z.number().default(0),
});
export type Member = z.infer<typeof MemberSchema>;
export type Members = Member[];

export const MemberInputSchema = (
    t: (key: string, params?: Record<string, string>) => string
) =>
    z.object({
        id: z.union([z.string(), z.number()]).optional(),
        name: z
            .string()
            .nonempty(
                t("validation.required", { attribute: t("attributes.name") })
            ),
        avatar: z.string().nullable().optional(),
        ratio: z
            .number({
                required_error: t("validation.required", {
                    attribute: t("attributes.ratio"),
                }),
                invalid_type_error: t("validation.required", {
                    attribute: t("attributes.ratio"),
                }),
            })
            .min(
                1,
                t("validation.min", {
                    attribute: t("attributes.ratio"),
                    min: "1",
                })
            )
            .max(
                100,
                t("validation.max", {
                    attribute: t("attributes.ratio"),
                    max: "100",
                })
            ),
        bank_info: z
            .string()
            .nullable()
            .optional()
            .transform((val) => (val ? val.replace(/\D/g, "") : val))
            .refine((val) => !val || val.length === 16, {
                message: t("validation.bankAccountLength", {
                    attribute: t("attributes.bank_info"),
                }),
            })
            .refine((val) => !val || /^\d+$/.test(val), {
                message: t("validation.bankAccountFormat", {
                    attribute: t("attributes.bank_info"),
                }),
            }),
        index: z.number().optional(),
    });
export type MemberInput = z.infer<ReturnType<typeof MemberInputSchema>>;
export type MembersInput = MemberInput[];
