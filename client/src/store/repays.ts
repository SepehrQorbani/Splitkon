import { create } from "zustand";
import { Repay } from "@/types/schemas/repays";

interface RepayStore {
    repays: Repay[];
    setRepays: (repays: Repay[]) => void;
    addRepay: (repay: Repay) => void;
    updateRepay: (repay: Repay) => void;
}

export const useRepayStore = create<RepayStore>((set) => ({
    repays: [],
    setRepays: (repays) => set({ repays }),
    addRepay: (repay: Repay) =>
        set((state) => ({ repays: [...state.repays, repay] })),
    updateRepay: (repay: Repay) =>
        set((state) => ({
            repays: state.repays.map((r) => (r.id === repay.id ? repay : r)),
        })),
}));
