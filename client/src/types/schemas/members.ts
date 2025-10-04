import { hasRole } from "@/utils/checkRoles";
import { z } from "zod";

const MemberStatus = z.object({
    title: z.enum(["settled", "creditor", "debtor"]),
    net: z.number(),
    percent: z.number(),
});

export const MemberSchema = z
    .object({
        id: z.number(),
        name: z.string().nonempty(),
        avatar: z.string().nullable().optional(),
        ratio: z.number().min(0).max(100).nullable().optional(),
        role: z.int().min(0).max(3).nullable().optional(),
        bank_info: z
            .string()
            .nullable()
            .transform((val) => (val ? val.replace(/\D/g, "") : val))
            .refine((val) => !val || val.length === 16, {
                message: "Bank info must be 16 digits",
            })
            .refine((val) => !val || /^\d+$/.test(val), {
                message: "Bank info must be numeric",
            })
            .optional(),
        total_expenses: z.number().default(0),
        payment_balance: z.number().default(0),
        status: MemberStatus.optional(),
    })
    .refine(
        (data) => {
            if (hasRole("wallet", data)) {
                return data.ratio === 0;
            } else {
                return data.ratio != null && data.ratio > 0;
            }
        },
        {
            message: "error",
            path: ["ratio"],
        }
    );

export type Member = z.infer<typeof MemberSchema>;
export type Members = Member[];

export const MemberInputSchema = (
    t: (key: string, params?: Record<string, string>) => string
) =>
    z
        .object({
            id: z.union([z.string(), z.number()]).optional(),
            name: z.string().nonempty(
                t("validation.required", {
                    attribute: t("attributes.name"),
                })
            ),
            avatar: z.string().nullable().optional(),
            ratio: z
                .number({
                    error: (issue) => {
                        if (issue.input === undefined) {
                            return t("validation.required", {
                                attribute: t("attributes.ratio"),
                            });
                        } else if (issue.code === "invalid_type") {
                            return t("validation.invalid_type", {
                                attribute: t("attributes.ratio"),
                            });
                        } else {
                            return undefined;
                        }
                    },
                })
                .min(
                    0,
                    t("validation.min", {
                        attribute: t("attributes.ratio"),
                        min: "0",
                    })
                )
                .max(
                    100,
                    t("validation.max", {
                        attribute: t("attributes.ratio"),
                        max: "100",
                    })
                )
                .optional(),
            amount: z
                .number({
                    error: (issue) => {
                        if (issue.input === undefined) {
                            return t("validation.required", {
                                attribute: t("attributes.amount"),
                            });
                        } else if (issue.code === "invalid_type") {
                            return t("validation.invalid_type", {
                                attribute: t("attributes.amount"),
                            });
                        } else {
                            return undefined;
                        }
                    },
                })
                .min(
                    0,
                    t("validation.min", {
                        attribute: t("attributes.amount"),
                        min: "0",
                    })
                )
                .optional(),
            role: z.int().min(0).max(3).nullable().optional(),
            bank_info: z
                .string()
                .nullable()
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
                })
                .optional(),
            index: z.number().optional(),
        })
        .refine(
            (data) => data.ratio !== undefined || data.amount !== undefined,
            {
                message: t("validation.at_least_one_required", {
                    fields: `${t("attributes.ratio")} یا ${t(
                        "attributes.amount"
                    )}`,
                }),
                path: ["ratio"],
            }
        );
// .refine(
//     (data) => {
//         if (hasRole("wallet", data)) {
//             return data.ratio === 0;
//         } else {
//             return data.ratio > 0;
//         }
//     },
//     {
//         message: t("validation.min", {
//             attribute: t("attributes.ratio"),
//             min: "1",
//         }),
//         path: ["ratio"],
//     }
// )

export type MemberInput = z.infer<ReturnType<typeof MemberInputSchema>>;
export type MembersInput = MemberInput[];
