import { Group } from "@/types/schemas/group";
import { create } from "zustand";
import { usePermissionStore } from "./permissions";

interface GroupStore {
    group: Group | null;
    currency: Group["currency"] | null;
    setGroup: (group: Group) => void;
    clearGroup: () => void;
    updateGroup: (updates: Partial<Group>) => void;
}
export const useGroupStore = create<GroupStore>((set, get) => ({
    group: null,
    currency: null,
    setGroup: (group: Group) => {
        set({ group });
        set({ currency: group.currency });
        usePermissionStore.getState().setPermissions(group);
    },
    clearGroup: () => {
        set({ group: null });
        set({ currency: null });

        usePermissionStore.getState().setPermissions(null);
    },
    updateGroup: (updates: Partial<Group>) => {
        const currentGroup = get().group;
        if (!currentGroup) return;

        const updatedGroup = { ...currentGroup, ...updates };

        set({ group: updatedGroup });

        if (updates.currency) {
            set({ currency: updates.currency });
        }

        usePermissionStore.getState().setPermissions(updatedGroup);
    },
}));
