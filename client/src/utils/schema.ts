import { z } from "zod";

const createMemberSchema = (
    t: (key: string, params?: Record<string, string>) => string
) =>
    z.object({
        id: z.string().or(z.number()),
        name: z
            .string()
            .nonempty(
                t("validation.required", { attribute: t("attributes.name") })
            ),
        avatar: z
            .string()
            .nonempty(
                t("validation.required", { attribute: t("attributes.avatar") })
            ),
        // .url(t("validation.url", { attribute: t("attributes.avatar") })),
        ratio: z
            .number()
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
            .optional() // Allows undefined or empty string
            .transform((val) => (val ? val.replace(/\D/g, "") : val)) // Strip non-digits only if value exists
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
    });

const createGroupSchema = (
    t: (key: string, params?: Record<string, string>) => string
) =>
    z.object({
        title: z
            .string()
            .nonempty(
                t("validation.required", { attribute: t("attributes.title") })
            ),
        description: z.string().optional(),
        members: z.array(createMemberSchema(t)).optional(),
    });

type Group = z.infer<ReturnType<typeof createGroupSchema>>;
type Member = z.infer<ReturnType<typeof createMemberSchema>>;
type SelectedMember = Member & { index: number };

export { createGroupSchema, createMemberSchema };
export type { Group, Member, SelectedMember };
