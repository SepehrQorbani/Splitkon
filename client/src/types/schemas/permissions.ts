import { z } from "zod";

export const PermissionsSchema = z.object({
    isAdmin: z.boolean(),
    canEdit: z.boolean(),
});

export type Permissions = z.infer<typeof PermissionsSchema>;
