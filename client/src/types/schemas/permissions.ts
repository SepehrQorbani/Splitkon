import { Group } from "./group";

export type PermissionKey =
    | "edit"
    | "addExpenses"
    | "editExpenses"
    | "deleteExpenses"
    | "addRepays"
    | "editRepays"
    | "deleteRepays"
    | "addMembers"
    | "editMembers"
    | "deleteMembers";

export interface PermissionDefinition {
    fn: (group: Group | null) => boolean;
    dependsOn?: PermissionKey[];
}
