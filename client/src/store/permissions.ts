import { create } from "zustand";
import { Group } from "@/types/schemas/group";
import { PermissionDefinition, PermissionKey } from "@/types";

interface PermissionStore {
    permissions: Record<PermissionKey, boolean>;
    setPermissions: (group: Group | null) => void;
}

export const PERMISSIONS: Record<PermissionKey, PermissionDefinition> = {
    edit: {
        fn: (group) => !!group?.edit_token,
    },
    //Expenses
    addExpenses: {
        fn: (group) => !!group && !group?.closing_date,
        dependsOn: ["edit"],
    },
    editExpenses: {
        fn: (group) => !!group && !group?.closing_date,
        dependsOn: ["edit"],
    },
    deleteExpenses: {
        fn: () => false,
    },
    //Repays
    addRepays: {
        fn: (group) => !!group,
        dependsOn: ["edit"],
    },
    editRepays: {
        fn: (group) => !!group,
        dependsOn: ["edit"],
    },
    deleteRepays: {
        fn: () => false,
    },
    //Members
    addMembers: {
        fn: (group) => !!group && !group?.closing_date,
        dependsOn: ["edit"],
    },
    editMembers: {
        fn: (group) => !!group && !group?.closing_date,
        dependsOn: ["edit"],
    },
    deleteMembers: {
        fn: () => false,
        dependsOn: ["edit"],
    },
};

export const usePermissionStore = create<PermissionStore>((set, get) => ({
    permissions: Object.fromEntries(
        Object.keys(PERMISSIONS).map((key) => [key, false])
    ) as Record<PermissionKey, boolean>,

    setPermissions: (group: Group | null) => {
        const permissions = get().permissions;

        for (const key of Object.keys(PERMISSIONS) as PermissionKey[]) {
            const perm = PERMISSIONS[key];
            let hasPerm = false;

            try {
                if (perm.dependsOn) {
                    const allDependenciesMet = perm.dependsOn.every(
                        (depKey) => {
                            try {
                                return PERMISSIONS[depKey].fn(group);
                            } catch (error) {
                                console.warn(
                                    `Error evaluating dependency ${depKey}:`,
                                    error
                                );
                                return false;
                            }
                        }
                    );
                    if (!allDependenciesMet) {
                        permissions[key] = false;
                        continue;
                    }
                }

                hasPerm = perm.fn(group);
            } catch (error) {
                console.warn(`Error evaluating permission ${key}:`, error);
            }

            permissions[key] = hasPerm;
        }

        set({ permissions });
    },
}));
