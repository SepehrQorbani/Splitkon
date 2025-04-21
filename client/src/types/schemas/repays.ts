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
                required_error: t("validation.required", {
                    attribute: t("attributes.from"),
                }),
            }),
            to_id: z.number({
                required_error: t("validation.required", {
                    attribute: t("attributes.to"),
                }),
            }),
            amount: z
                .number({
                    required_error: t("validation.required", {
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
                .date(), // Validates ISO date string (e.g., "2025-04-02")
            description: z.string().optional(),
        })
        .refine((data) => data.from_id !== data.to_id, {
            message: t("validation.from_to_different"),
            path: ["to_id"],
        });
export type RepayInput = z.infer<ReturnType<typeof RepayInputSchema>>;
