import { PermissionKey, usePermissionStore } from "@/store/permissions";

interface PermissionResult {
    can: (key: PermissionKey) => boolean;
}

export const usePermissions = (): PermissionResult => {
    const permissions = usePermissionStore((state) => state.permissions);

    const can = (key: PermissionKey): boolean => permissions[key] || false;

    return { can };
};
