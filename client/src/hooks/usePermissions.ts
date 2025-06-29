import { usePermissionStore } from "@/store/permissions";
import { PermissionKey } from "@/types";

interface PermissionResult {
    can: (key?: PermissionKey) => boolean;
}

export const usePermissions = (): PermissionResult => {
    const permissions = usePermissionStore((state) => state.permissions);

    const can = (key?: PermissionKey): boolean => {
        if (key === undefined) return false;
        return permissions[key] || false;
    };

    return { can };
};
