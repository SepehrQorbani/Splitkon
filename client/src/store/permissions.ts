import { create } from "zustand";
import { Group } from "@/types/schemas/group";

interface PermissionStore {
    isAdmin: boolean;
    canEdit: boolean;
    setPermissions: (group: Group | null) => void;
}

export const usePermissionStore = create<PermissionStore>((set) => ({
    isAdmin: false,
    canEdit: false,
    setPermissions: (group: Group | null) => {
        if (!group) {
            set({ isAdmin: false, canEdit: false });
            return;
        }

        set({
            isAdmin: !!group.edit_token,
            canEdit: !!group.edit_token,
        });
    },
}));
