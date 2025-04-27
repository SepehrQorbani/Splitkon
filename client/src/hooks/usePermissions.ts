import { usePermissionStore } from "@/store/permissions";

export const usePermissions = () => {
    const canEdit = usePermissionStore((state) => state.canEdit);

    return {
        canEdit,
    };
};
