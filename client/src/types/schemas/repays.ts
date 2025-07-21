import { z } from "zod";
import { Member } from "./members";

// type ExpenseMember = Member & {
//     share: number;
//     remainder: number;
// };

export type Repay = {
    id: number;
    from_id: number;
    to_id: number;
    amount: number;
    date: string;
    description?: string;
    from: Member;
    to: Member;
};

export const RepayInputSchema = (
    t: (key: string, params?: Record<string, string>) => string
) =>
    z
        .object({
            from_id: z.number({
                error: (issue) => {
                    if (issue.input === undefined) {
                        return t("validation.required", {
                            attribute: t("attributes.from"),
                        });
                    } else if (issue.code === "invalid_type") {
                        return t("validation.invalid_type", {
                            attribute: t("attributes.from"),
                        });
                    } else {
                        return undefined;
                    }
                },
            }),
            to_id: z.number({
                error: (issue) => {
                    if (issue.input === undefined) {
                        return t("validation.required", {
                            attribute: t("attributes.to"),
                        });
                    } else if (issue.code === "invalid_type") {
                        return t("validation.invalid_type", {
                            attribute: t("attributes.to"),
                        });
                    } else {
                        return undefined;
                    }
                },
            }),
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
                    1,
                    t("validation.min", {
                        attribute: t("attributes.amount"),
                        min: "1",
                    })
                ),
            date: z
                .string({
                    error: (issue) => {
                        if (issue.input === undefined) {
                            return t("validation.required", {
                                attribute: t("attributes.date"),
                            });
                        } else {
                            return undefined;
                        }
                    },
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
            description: z.string().optional(),
        })
        .refine((data) => data.from_id !== data.to_id, {
            message: t("validation.from_to_different"),
            path: ["to_id"],
        });

export type RepayInput = z.infer<ReturnType<typeof RepayInputSchema>>;
