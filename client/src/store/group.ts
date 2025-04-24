import { Group } from "@/types/schemas/group";
import { create } from "zustand";

interface GroupStore {
    group: Group | null;
    currency: Group["currency"] | null;
    setGroup: (group: Group) => void;
}
export const useGroupStore = create<GroupStore>((set, get) => ({
    group: null,
    currency: null,
    setGroup: (group: Group) => {
        set({ group });
        set({ currency: group.currency });
    },
}));
