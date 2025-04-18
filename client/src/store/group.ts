import { Group } from "@/types/schemas/group";
import { create } from "zustand";

interface GroupStore {
    group: Group | null;
    setGroup: (group: Group) => void;
}
export const useGroupStore = create<GroupStore>((set, get) => ({
    group: null,
    setGroup: (group: Group) => set({ group }),
}));
