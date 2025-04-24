import { z } from "zod";
import { MemberInputSchema } from "./members";

export const GroupSchema = z.object({
    id: z.number(),
    title: z.string(),
    date: z.string(),
    currency: z.object({
        code: z.string(),
        display_unit: z.string(),
        conversion_factor: z.number(),
        decimal_precision: z.number(),
    }),
    description: z.string().optional(),
    view_token: z.string(),
    edit_token: z.string().nullable(),
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
